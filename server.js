var
    path = require('path'),
    fs = require('fs'),
    nowjs = require("now"),
    express = require("express"),
    util = require("util"),

    PORT = 8080,
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

server.listen(8080);

var everyone = nowjs.initialize(server);

var interval; 

//Connect and disconnect functions, group managers
everyone.on('connect', function() {
	util.log('connect');
    //joinGroup(this.now.roomID, this);
});

everyone.on('disconnect', function() {
	everyone.now.receiveDeleteBoard(this.user.clientId);
	/*
    var group = nowjs.getGroup(this.now.roomID);
    if (group.player == this.user.clientId) {
        group.player = null;
    }*/
});

everyone.joinGroup = function (groupId, client) {
    // Add a user to a group
    var group = nowjs.getGroup(groupId);

    group.addUser(client.user.clientId);
    util.log("Client " + client.user.clientId + " was added to group " + groupId);
}

everyone.now.sendToggleCell = function (col, row) {
		everyone.now.receiveToggleCell(col, row, this.user.clientId);
}

everyone.now.sendAddBoard = function (type) {
		everyone.now.receiveAddBoard(type, this.user.clientId); 
}

everyone.now.sendStart = function (size) {
	var index = 0;
	
	util.log(size);
	
	if (!interval) {
		interval = setInterval(function(){
			everyone.now.nextLine(index);
			if (index % (size[1] - 1) === 0 && index !== 0){
				index = 0;
			} else {
				index++
			}
		}, 250);
	}
}

