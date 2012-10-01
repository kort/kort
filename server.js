/**
 * @author Nils Dehl <mail@nils-dehl.de>
 */
var http = require('http'),
		sys  = require('sys'),
		fs   = require('fs');
var connect = require('connect');

var app = connect()
  .use(connect.logger('dev'))
  .use(connect.static(__dirname))
  .use(function(req, res){
    res.end('hello world\n');
  });

var port = process.env.PORT || 8080;
http.createServer(app).listen(port);
