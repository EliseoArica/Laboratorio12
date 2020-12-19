var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var multer = require('multer');
var cors = require('cors');

var indexRouter = require('./routes/index');
var prodsRouter = require('./routes/productos');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// middlewares
var storage = multer.diskStorage({
  destination: path.join(__dirname, 'public/images'),
  filename: function (req, file, callback) {
    callback(null, Date.now() + path.extname(file.originalname));
  }
});
app.use(multer({storage: storage}).single('image'));

app.use('/', indexRouter);
app.use('/api/productos', prodsRouter);

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
