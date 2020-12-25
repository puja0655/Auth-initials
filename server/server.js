const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require('passport');
const users = require('./routes/users');
const app = express();
const cors = require('cors');
require('dotenv').config()

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());
app.use(passport.initialize());  //middleware for passport
require('./config/passport')(passport); //passport config
app.use('/users',users);
app.use(cors());
const db = process.env.mongoURI;

mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log("connected to the server successfully"))
  .catch(err => console.log(err));
const port = process.env.PORT || 5000; 
app.listen(port, () => console.log(`Server up and running on port ${port} !`));
