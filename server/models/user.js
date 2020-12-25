const mongoose = require('mongoose');
const schema = mongoose.Schema;

const UserSchema = new schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default: Date.now
    },
    resetToken:String,
    expireToken:Date
},{
    timestamps:true
});
module.exports = User = mongoose.model("users",UserSchema);