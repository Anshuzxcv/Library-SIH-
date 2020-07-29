const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const _ = require('lodash');
const mongoose = require('mongoose');
const validator = require('validator');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = express();
app.use(express.static('public'));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.set('view engine', 'ejs');

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);
console.log(DB);
mongoose
  .connect(DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connection successful!'));

const studentSchema = {
  name: {
    type: String,
    required: true,
  },
  roll: {
    type: Number,
    required: true,
    unique: true,
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
      isAsync: false,
    },
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please fill a valid email address',
    ],
  },
  mobile: {
    type: Number,
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
};
const Student = mongoose.model('Student', studentSchema);

const adminSchema = {
  name: {
    type: String,
    required: true,
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
      isAsync: false,
    },
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please fill a valid email address',
    ],
  },
  password: {
    type: String,
    required: true,
  },
};
const Admin = mongoose.model('Admin', adminSchema);

const bookSchema = {
  name: {
    type: String,
    required: true,
  },
  isbnNumber: {
    type: Number,
    required: true,
  },
  floorNumber: {
    type: Number,
    required: true,
  },
  columnNumber: {
    type: Number,
    required: true,
  },
  shelfNumber: {
    type: Number,
    required: true,
  },
  avilability: Number,
};
const Book = mongoose.model('Book', bookSchema);

const requestSchema = {
  email: String,
  roll: Number,
  book: String,
  author: String,
};
const Request = mongoose.model('Request', requestSchema);

const issueSchema = {
  roll: Number,
  isbn: {
    type: Number,
    required: true,
  },
};

const Issue = mongoose.model('Issue', issueSchema);

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get('/', function (req, res) {
  res.render('signup');
});

app.get('/:paramname', function (req, res) {
  const paramname = _.toLower(req.params.paramname);
  if (paramname === 'contact') {
    res.render('contact');
  } else if (paramname === 'signout') {
    res.render('signup');
  } else if (paramname === 'adminlogin') {
    res.render('adminlogin');
  } else if (paramname === 'studentlogin') {
    res.render('studentlogin');
  } else if (paramname === 'adminhome') {
    res.render('adminhome');
  } else if (paramname === 'studenthome') {
    res.render('studenthome');
  } else if (paramname === 'request') {
    res.render('request');
  } else if (paramname === 'requests') {
    Request.find({}, function (err, requests) {
      if (!err) {
        res.render('requests', {
          requests: requests,
        });
      }
    });
  } else if (paramname === 'studentdashboard') {
    Book.find({}, function (err, books) {
      if (!err) {
        res.render('studentdashboard', {
          books: books,
        });
      }
    });
  } else if (paramname === 'admindashboard') {
    Book.find({}, function (err, books) {
      if (!err) {
        res.render('admindashboard', {
          books: books,
        });
      }
    });
  } else if (paramname === 'issue') {
    res.render('issue');
  } else if (paramname === 'return') {
    res.render('return');
  } else if (paramname === 'notification') {
    res.render('notification');
  } else if (paramname === 'studentprofile') {
    res.render('studentprofile');
  } else if (paramname === 'adminprofile') {
    res.render('adminprofile');
  } else if (paramname === 'add-modify') {
    res.render('add-modify');
  } else if (paramname === 'shelfmap') {
    res.render('shelfmap');
  } else if (paramname === 'signout') {
    res.render('signup');
  }
});

app.post('/search', function (req, res) {
  const inputbook = req.body.bookname;
  Book.findOne({ name: inputbook }, function (err, book) {
    if (!err) {
      if (book) {
        res.render('search', {
          name: book.name,
          isbn: book.isbnNumber,
          floor: book.floorNumber,
          column: book.columnNumber,
          shelf: book.shelfNumber,
          avilability: book.avilability,
        });
      } else {
        res.send('Book is not avilable in Library');
      }
    }
  });
});
app.post('/signup', function (req, res) {
  if (req.body.password === req.body.conformPassword) {
    const student = new Student({
      name: req.body.name,
      roll: req.body.roll,
      email: req.body.email,
      mobile: req.body.mobile,
      branch: req.body.branch,
      password: req.body.password,
    });
    student.save(function (err, posts) {
      if (!err) {
        res.redirect('/');
      }
    });
  } else {
    res.send("Password and conform password doesn't match");
  }
});

app.post('/add-modify', function (req, res) {
  const newBook = new Book({
    name: req.body.formname,
    isbnNumber: req.body.formisbn,
    floorNumber: req.body.formfloor,
    columnNumber: req.body.formcolumn,
    shelfNumber: req.body.formshelf,
    avilability: req.body.formavilability,
  });
  newBook.save(function (err, posts) {
    if (!err) {
      res.redirect('/adminhome');
    }
  });
});

app.post('/request', function (req, res) {
  const newRequest = new Request({
    email: req.body.inputEmail,
    roll: req.body.inputRoll,
    book: req.body.inputBookName,
    author: req.body.inputAuthor,
  });
  newRequest.save(function (err, posts) {
    if (!err) {
      res.redirect('/studenthome');
    }
  });
});

app.post('/studentlogin', function (req, res) {
  var inputRoll = req.body.inputRoll;
  Student.findOne({ roll: inputRoll }, function (err, student) {
    if (!student) {
      res.send('User is not registered');
    } else {
      if (req.body.inputPassword === student.password) {
        res.render('studenthome');
      } else {
        res.send('Entered password is incorrect');
      }
    }
  });
});

app.post('/adminlogin', function (req, res) {
  var inputEmail = req.body.inputEmail;
  Student.findOne({ email: inputEmail }, function (err, admin) {
    if (!admin) {
      res.send('User is not registered');
    } else {
      if (req.body.inputPassword === admin.password) {
        res.render('adminhome');
      } else {
        res.send('Entered password is incorrect');
      }
    }
  });
});

app.listen(3000, function () {
  console.log('Port 3000 is running.');
});
