const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();

const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");

const User = require("../models/user");


const transporter = nodemailer.createTransport({
  service:'gmail',
  auth:{
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});


router.post('/register',(req,res)=>{
   const { errors, isValid} = validateRegisterInput(req.body);

      if(!isValid){
          return res.status(400).json(errors);
      }
  User.findOne({email:req.body.email}).then(user => {
      if(user){
          return res.status(400).json({email:"Email already exists"});
      }
      else{
          const newUser = new User({
              name: req.body.name,
              email: req.body.email,
              password: req.body.password
          }); 

          bcrypt.genSalt(10,(err, salt) => {
              bcrypt.hash(newUser.password,salt,(err,hash)=>{
                  if(err) throw err;
                  newUser.password = hash;
                  newUser
                  .save()
                  .then(user => res.json(user))
                  .catch(err => console.log(err))
              });
          });
      }
  });

});


router.post('/login',(req,res)=>{
    const { errors, isValid } = validateLoginInput(req.body);
    
      if (!isValid) {
        return res.status(400).json(errors);
      }
    const email = req.body.email;
      const password = req.body.password;
    
      User.findOne({ email }).then(user => {
        
        if (!user) {
          return res.status(404).json({ emailnotfound: "Email not found" });
        }
    
        bcrypt.compare(password, user.password).then(isMatch => {
          if (isMatch) {
            
            
            const payload = {
              id: user.id,
              name: user.name
            };
    
            jwt.sign(
              payload,
              process.env.secretOrKey,
              {
                expiresIn: 31556926 // 1 year in seconds
              },
              (err, token) => {
                res.json({
                  success: true,
                  token: "Bearer " + token
                });
              }
            );
          } else {
            return res
              .status(400)
              .json({ passwordincorrect: "Password incorrect" });
          }
        });
      });  
});

router.post('/reset_password',(req,res)=>{

         //res.send("Hiii");
           crypto.randomBytes(32,(err,buffer)=>{
             if(err){
               console.log(err);
             }
             const token = buffer.toString('hex')
             User.findOne({email:req.body.email})
               .then(user=>{
                 if(!user){
                   return res.status(422).json({error:"This email doesn't exists!"})
                 }
                 user.resetToken = token;
                 user.expireToken = Date.now()+3600000 ; // token will be valid for 1 hr
                 user.save().then((result)=>{
                   transporter.sendMail({
                     to:user.email,
                     from:'pujakumarinwd0039@gmail.com',
                     subject:'Password Reset',
                     html:`
                     <p>Reset the password</p>
                     <h2>click on this <a href="http://localhost:3000/reset/${token}">link</a> to change password</h2>
                     `
                   }).then((message) => {
                     
                    res.json('mail has been sent');

                   });
               })
           })
          })
});

router.post('/new-password',(req,res)=>{
  
  const newPassword = req.body.password
  const sentToken = req.body.token
  console.log("token: ",sentToken)
  User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
    .then(user=>{
      if(!user){
        return res.json({error:"Try Again"})
      }
      bcrypt.hash(newPassword,12).then(hashedpassword=>{
        user.password = hashedpassword
        user.resetToken = undefined
        user.expireToken = undefined
        user.save().then(saveduser=>{
          
           res.json({message:"password updated successfully"})
        })
      })
    })
    .catch(err=>{
      res.error(err)
    })
})

module.exports = router;