const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const countersRouter = require('./routes/counters');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/static',express.static(path.join(__dirname, 'public')));
app.use(cors());

const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');

const dbUser = process.env.dbUser;
const dbUserPassword = process.env.dbUserPassword;
const nameCollection = process.env.nameCollection;

const mongodbUri = `mongodb+srv://${dbUser}:${dbUserPassword}@cluster0.ebunvbh.mongodb.net/${nameCollection}?retryWrites=true&w=majority`;

mongoose.connect(mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true });
const database = mongoose.connection;

database.on('error', console.error.bind(console, 'connection error:'));
database.once('open', function() {
  console.log('MongoDB connected!');  
});

app.locals.database = database;
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/counters', countersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
