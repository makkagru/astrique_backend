var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var jwt = require('jsonwebtoken');
var logger = require('morgan');
var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authorsRouter = require('./routes/authors');
var listingsRouter = require('./routes/listings');
var collectionsRouter = require('./routes/collections');
var registerRouter = require('./routes/auth/register');
var loginRouter = require('./routes/auth/login');

var app = express();

mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connected');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  if (req.method !== "GET") {
    if (!req.headers.authorization) {
      return res.status(400).json({
        success: false,
        error: 'Something goes wrong'
      });
    }
    const token = req.headers.authorization.split('Bearer ');
    jwt.verify(token[1], 'cHrgAh4565$58|@56!aAhjAbnbWrT454Hw3rr55f4aG#%()4a1g5Ha', function(err) {
      if(err) {
        return res.status(403).json({
          success: false,
          error: "You don't have access"
        });
      }
      return next();
    });
  } else {
    next();
  }
});

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/authors', authorsRouter);
app.use('/api/listings', listingsRouter);
app.use('/api/collections', collectionsRouter);
app.use('/api/register', registerRouter);
app.use('/api/login', loginRouter);

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
