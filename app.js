var express = require('express');
var http = require('http');
var path = require('path');
var app = module.exports = express();
var mail = require('./mail');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');
app.use(express.favicon());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
//app.use(require('less-middleware')(path.join(__dirname, 'public')));  //ntvs stuggles to compile the less-middleware, just use winless as needed or a patch is released
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  	app.use(express.errorHandler());
	app.use(express.logger('dev'));
}

//init all routes
var routes = require('./routes');

http.createServer(app).listen(app.get('port'), function(){
  //mail.sendEmail();  ///this works, please don't spam me
  console.log('Express server listening on port ' + app.get('port'));
});
