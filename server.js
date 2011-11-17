var
    path = require('path'),
    fs = require('fs'),
    nowjs = require("now"),
    express = require("express"),
    redislib = require("redis"),
    util = require("util"),

    PORT = 8003,
    WEBROOT = path.join(path.dirname(__filename), '/webroot'),
    nowjs = require("now");



//Create express server
var server = express.createServer();
//Define static files
server.use('/static',express.static(WEBROOT));
//Define route for the homepage
server.get('/',function(req, response){
    fs.readFile(WEBROOT+'/index.html', function(err, data){
        response.writeHead(200, {'Content-Type':'text/html'});
        response.write(data);
        response.end();
    });
});
//Define route for a playlist
server.get('/playlist/*',function(req, response){
    fs.readFile(WEBROOT+'/playlist.html', function(err, data){
        response.writeHead(200, {'Content-Type':'text/html'});
        response.write(data);
        response.end();
    });
});

//Define route for a playlist
server.get('/mobile/*',function(req, response){
    fs.readFile(WEBROOT+'/mobile/index.html', function(err, data){
        response.writeHead(200, {'Content-Type':'text/html'});
        response.write(data);
        response.end();
    });
});
server.listen(8080);
var everyone = nowjs.initialize(server);
