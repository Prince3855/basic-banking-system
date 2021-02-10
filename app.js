const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session')
require('dotenv').config()

// const dummyData = require('./dummyData.js');
// dummyData();


const indexRouter = require('./routes/index');
const customersRouter = require('./routes/customers');

const app = express();

// connect to the database
mongoose.connect(process.env.DB_LINK, { 
  useNewUrlParser: true,
  useUnifiedTopology: true, 
  useFindAndModify: false, 
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('we\'re connected!');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// session setup
app.use(session({
  secret: 'BankApp',
  resave: false,
  saveUninitialized: true,
}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next){
  // set common title
  res.locals.title = "PAL Bank";
  // set success flash message
  res.locals.success = req.session.success || '';
  delete req.session.success;
  // set error flash message
  res.locals.error = req.session.error || '';
  delete req.session.error;
  next();
});

// Mount routes
app.use('/', indexRouter);
app.use('/customers', customersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  console.log(err);
  req.session.error = err.message;
  res.redirect('back');
});

module.exports = app;
