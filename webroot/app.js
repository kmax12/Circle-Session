function CircleSession (type, instrument){
	var boards = {},
	stepTime = 500,
	interval,
	size = [8,12],
	type = type,
	init;
		
	var start = function () {
		now.sendStart(size);
	}
	
	var stop = function () {
		clearInterval(interval)
	}
	
	var addBoard = function(instrument, userID){
		if (!userID){
			userID = 1;
		}
		
		boards[userID] = new Board(instrument, userID, size, type);
	}
	
	var deleteBoard = function(clientID) {
			boards[clientID].deleteSelf();
			delete boards[clientID];
	}
			
	now.nextLine = function(index){
		for (var x in boards){
				boards[x].playLine(index);
		}	
		
	}
		
	if(type == "host") {
		now.receiveToggleCell = function (col, row, userID) {
			boards[userID].toggleCell(col,row);
		}
		
		now.receiveAddBoard = function(instrument, userID){
			addBoard(instrument, userID);
		}

		now.receiveDeleteBoard = function(userID){
			deleteBoard(userID);
		}
	
		console.log(size);
		now.sendStart(size)
	} else if (type == "client") {
		addBoard(instrument)
		now.sendAddBoard(instrument);
	}
	
	return {
		start: start,
		addBoard: addBoard,
		stop: stop
	}
}

function Board(instrument, userID, size, type){
	var size = size,
	cells = [],
	boardDiv = document.createElement('div'),
	id = "board"+userID,
	$boardDiv;
			
	var init = function () {
		var j, i, addArr,
		addHTML = "";
		addClass = (type=="host")? 'host-table' : 'client-table';
		
		for (i=0; i<size[1]; i++) {	
			var addArr = [];
			addHTML += '<tr>';
			
			for (j=0; j<size[0]; j++) {
				if (type == "host"){
					console.log(instrument);
					addArr.push([new AudioTrack('static/audio/'+instrument+'/ns'+j+'.wav',0), 0]); //audiotrack, on/off
				}
				addHTML += '<td class="off">'+j+'</td>';
			}
			
			cells.push(addArr);
			addHTML += '</tr>';
			//
		}
		
		
		boardDiv.innerHTML = "<table class='bw "+addClass+"'>" + addHTML + "</table>";
		
		boardDiv.id = id;
		$('body').append(boardDiv);
		$boardDiv = $('#'+id);
		
		if (type == 'client') {
			$boardDiv.on("touchstart", "td", function(event){
				$(this).toggleClass('on');
				
				var $tr = $(this).parent();
				var col = $(this).index();
				var row = $tr.index();
				
				now.sendToggleCell(col,row);
			});
		}
	}
	
	var playLine = function (l) {
		
		var line = cells[l];
		$boardDiv.find('tr').eq(l-1).removeClass('row-highlight');
		$boardDiv.find('tr').eq(l).addClass('row-highlight');
		
		
		if (type == "host") {
			for (var i=0; i<size[0]; i++){
					if (line[i][1] === 1){
						line[i][0].setTime(0);
						line[i][0].play();
					}
			}
		}
	}
	
	
	var toggleCell = function (col, row) {
		if(cells[row][col][1]===0){
			cells[row][col][1] = 1;
		} else {
			cells[row][col][1] = 0
		}
		
		console.log($boardDiv.find('tr').eq(row).find('td').eq(col));
		$boardDiv.find('tr').eq(row).find('td').eq(col).toggleClass('on');		
	}
	
	var deleteSelf = function () {
			$boardDiv.remove();
	}
	init();
	
	
	return {
		playLine: playLine,
		toggleCell: toggleCell,
		deleteSelf: deleteSelf
	}
	
}


function AudioTrack (src, start){
	var audio = new Audio(src);

	if(!start){
		start = 0;
	}
	
	
	
	var play = function (){
		audio.play();
	}
	
	var currentTime = function(){
		return audio.currentTime;
	}
	
	var setTime = function(time){
		audio.currentTime = time;
	}
	
	audio.addEventListener("ended", function () {
		remove();
	}, false);
	
	var remove = function (){
		pause();
	}
	
	var pause = function () {
		audio.pause();
	}
	
	var fadeOut = function(){
		self = this;
		var timer = setInterval(function(){
			if (audio.volume <= .1){
				audio.volume =  0;
				self.remove();
				clearInterval(timer);
			} else {
				audio.volume = audio.volume - .05;
			}
					
		}, 10);
	}
	
	return {
		play:play,
		currentTime: currentTime,
		setTime: setTime,
		remove: remove,
		fadeOut: fadeOut,
		audio: audio
	};
}

