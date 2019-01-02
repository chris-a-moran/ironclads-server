var createError = require('http-errors');
var express = require('express');
var cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs');
var https = require('https');

var indexRouter = require('./routes/index');
var prototypeRouter = require('./routes/prototype');
var fireRouter = require('./routes/fireShot');
var gameMgmtRouter = require('./routes/gameMgmt');

var bodyParser = require('body-parser');
//var port = 443;
//var domainName = "critpen.com";

var app = express();


let settingsStr = fs.readFileSync('/run/secrets/settings.json', 'utf8');
var settings = JSON.parse(settingsStr);
var domainName = settings.domainName;
var port = settings.port;

// view engine setup
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use('/', prototypeRouter);
app.use('/', indexRouter);
app.use('/', fireRouter);
app.use('/', gameMgmtRouter);


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
const options = {
  key: fs.readFileSync('/run/secrets/ironclads-server.key'),
  cert: fs.readFileSync('/run/secrets/ironclads-server.crt')
};

// The listen method was not created as part of the framework,
// but searching on Stackoverflow, this is the way to enable the app
// to be run using the 'node app.js' from the command line rather than
// using 'npm start'

//app.listen(port, function() {
//  console.log("Ironclads server running on http://" + domainName + ":" + port);
//});
var server = https.createServer(options, app).listen(port);
