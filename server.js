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

var everyone = nowjs.initialize(server),
interval,
hosts = []; 

//Connect and disconnect functions, group managers
everyone.on('connect', function() {
	util.log('connect');
});

everyone.on('disconnect', function() {
	everyone.now.receiveDeleteBoard(this.user.clientId);
});

everyone.now.joinGroup = function (groupId, host) {
    // Add a user to a group
    /*if (host) {
			hosts.push(groupId);
	}*/
	
	//if (hosts.indexOf(groupId) > -1) {
		var group = nowjs.getGroup(this.now.room);
		group.addUser(this.user.clientId);
		util.log(this.user.clientId + 'is in' + this.now.room);
		//return true;
	//} else {
		//return false;
	//}
}

everyone.now.sendToggleCell = function (col, row) {
		var group = nowjs.getGroup(this.now.room)
		group.now.receiveToggleCell(col, row, this.user.clientId);
}

everyone.now.sendAddBoard = function (instrument) {
		var group = nowjs.getGroup(this.now.room)
		group.now.receiveAddBoard(instrument, this.user.clientId); 
}

everyone.now.sendStart = function (size) {
	var index = 0;
	if (interval){
		util.log(interval);
	}
	if (!interval) {
		util.log('start');
		var size = size;
		var group = nowjs.getGroup(this.now.room)
		interval = setInterval(function(){
			group.now.nextLine(index);
			
			if (index % (size[1] - 1) === 0 && index !== 0){
				index = 0;
			} else {
				index++
			}
		}, 300);
	}
}

