// https://expressjs.com/en/starter/generator.html
// https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4
// http://www.tutorialspoint.com/nodejs/nodejs_response_object.htm
// http://lollyrock.com/articles/nodejs-encryption/
// https://scotch.io/tutorials/creating-a-single-page-todo-app-with-node-and-angular
// https://expressjs.com/en/starter/static-files.html

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

require('./mongoose/Connector.js');
require('./utils/CronJob.js');

var routes = require('./routes/index');
var api = require('./routes/api');
var Constants = require('./utils/Constants.js');

var app = express();
const views = path.join(__dirname, 'views');
const public = path.join(__dirname, 'public');

// view engine setup
app.set('views', views);
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(public));

app.listen(Constants.PORT);
console.log("App listening on port " + Constants.PORT);

app.use('/', routes);
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;