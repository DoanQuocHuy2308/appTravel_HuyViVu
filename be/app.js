var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
require("dotenv").config();

var usersRouter = require('./routes/usersRoutes');
var AccsRouter = require('./routes/accRouters');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public/images', express.static(path.join(__dirname, 'public/images')));
app.use(cors());

app.use('/users', usersRouter);
app.use('/acc', AccsRouter);

app.use(function(req, res, next) {
  next(createError(404));
});
app.listen(3000, '0.0.0.0', () => {
  console.log('Server running on port 3000');
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
