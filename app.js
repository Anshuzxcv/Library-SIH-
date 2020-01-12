const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const validator = require('validator');
const path = require("path");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/libraryDB", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true
});

const studentSchema = {
  name:{
    type: String,
    required:true
  },
  roll:{
    type: Number,
    required: true,
    unique: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: 'Email address is required',
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email',
      isAsync: false
    },
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  mobile:{
    type: Number,
    required:true
  },
  branch:{
    type: String,
    required:true
  },
  password:{
    type: String,
    required:true
  },
}
const Student = mongoose.model("Student", studentSchema);

const adminSchema = {
  name:{
    type: String,
    required:true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: 'Email address is required',
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email',
      isAsync: false
    },
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password:{
    type: String,
    required:true
  },
}
const Admin = mongoose.model("Admin", adminSchema);

app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.render("signup");
});

app.get("/:paramname", function(req, res) {
  const paramname = _.toLower(req.params.paramname);
  res.render(paramname);
});

app.post("/signup", function(req, res) {
  if (req.body.password === req.body.conformPassword) {
    const student = new Student({
      name: req.body.name,
      roll: req.body.roll,
      email: req.body.email,
      mobile: req.body.mobile,
      branch: req.body.branch,
      password: req.body.password,
    });
    student.save(function(err, posts) {
      if (!err) {
        res.redirect("/");
      }
    });
  } else {
    res.send("Password and conform password ddoesn't match");
  }
});

app.post("/studentlogin", function(req, res){

  Student.findOne({roll: req.body.inputRoll}, function(err, student){
    if(!student){
      res.send("User is not registered");
    }else{
      if(req.body.inputPassword === student.password){
        res.render("home");
      }else{
        res.send("Entered password is incorrect");
      }
    }
  });
});

app.post("/adminlogin", function(req, res){

  Student.findOne({email: req.body.inputEmail}, function(err, admin){
    if(!admin){
      res.send("User is not registered");
    }else{
      if(req.body.inputPassword === admin.password){
        res.render("home");
      }else{
        res.send("Entered password is incorrect");
      }
    }
  });
});

app.listen(3000, function() {
  console.log("Port 3000 is running.");
});
