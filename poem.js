function App (type){
	var boards = [],
	stepTime = 500,
	interval,
	index = 0,
	size = [8,20];
	
	switch(type){
		case 'mobileClient':
		
		break;
		
		case 'desktopClient':
		
		break;
		
		case 'host':
		
		break;
	}
	
	var start = function(){
		interval = setInterval(function(){
			nextLine()
		}, stepTime)
	}
	
	var stop = function () {
		clearInterval(interval)
	}
	
	var addBoard = function(type){
		boards.push(new Board(boards.length,type, size));
	}
	
	var nextLine = function(){
		for (var i=0, max = boards.length; i<max; i++){
				boards[i].playLine(index);
		}
		
		if (index % (size[1] - 1) === 0 && index !== 0){
			index = 0;
		} else {
			index++
		}
			
		
	}
	
	return {
		addBoard: addBoard,
		start: start,
		stop: stop
	}
}

function Board(number, type, size){
	var size = size,
	cells = [],
	boardDiv = document.createElement('div'),
	id = "board"+number,
	$boardDiv;
			
	var init = function () {
		var j, i, addArr,
		addHTML = "";
		
		console.log(size);
		for (i=0; i<size[1]; i++) {	
			var addArr = [];
			addHTML += '<tr>';
			
			for (j=0; j<size[0]; j++) {
				addArr.push([new AudioTrack('audio/'+type+'/ns'+j+'.wav',0), 0]); //audiotrack, on/off
				addHTML += '<td class="off">'+j+'</td>';
			}
			
			cells.push(addArr);
			addHTML += '</tr>';
			//
		}
		
		boardDiv.innerHTML = "<table>" + addHTML + "</table>";
		
		boardDiv.id = id;
		$('body').append(boardDiv);
		$boardDiv = $('#'+id);
			
		$boardDiv.on("click", "td", function(event){
			$(this).toggleClass('on');
			
			var $tr = $(this).parent();
			var col = $(this).index();
			var row = $tr.index();
			
			if(cells[row][col][1]===0){
				cells[row][col][1] = 1;
			} else {
				cells[row][col][1] = 0
			}		
		});
	}
	
	var playLine = function (l) {
		
		var line = cells[l];
		$boardDiv.find('tr').eq(l-1).removeClass('row-highlight');
		$boardDiv.find('tr').eq(l).addClass('row-highlight');
		
		for (var i=0; i<size[0]; i++){
				if (line[i][1] === 1){
					line[i][0].setTime(0);
					line[i][0].play();
				}
		}
	}
	
	init();
	
	
	return {
		playLine: playLine
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





$(document).ready(function(){
	app = new App();
	app.addBoard('synth');
	app.start();
	/*
	setInterval(function(){
		var sounds = tracks[count%length];
		for (var i=0; i<noTracks; i++){
			track = sounds[i];
			//track.setTime(0);
			track.play();
		}
		count++;
	},1000);*/

		
});


//
