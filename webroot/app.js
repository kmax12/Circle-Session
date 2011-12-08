function CircleSession (type, instrument){
	window.scrollTo(0, 1);
	var boards = {},
	stepTime = 500,
	interval,
	size = [8,12],
	type = type,
	init,
	boardCount = 0;
		
	var start = function () {
		now.sendStart(size);
	}
	console.log('m');
	var stop = function () {
		clearInterval(interval)
	}
	
	var addBoard = function(instrument, userID){
		if (!userID){
			userID = 1;
		}
		
		
		
		
		
		boards[userID] = new Board(instrument, userID, size, type);
		
		if (type == 'host') {
				console.log(boardCount);
				boards[userID].position(215*boardCount, (boardCount % 2)*100+50);
		}
		
		boardCount++;
	}
	
	var deleteBoard = function(clientID) {
			if (boards[clientID]){
				boards[clientID].deleteSelf();
			
				delete boards[clientID];
			}
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
		
		now.sendStart(size)
	} else if (type == "client") {
		addBoard(instrument);
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
	$boardDiv,
	ios = false;
	mousedown = false,
	lastElems = {},
	lastElem = null,
	currElem = null,
	currElems = [];
	
	if (navigator.userAgent.toLowerCase().search('ipad') >-1 || navigator.userAgent.toLowerCase().search('iphone') >-1) {
		var downEvent = 'touchstart',
		dragEvent = 'touchmove',
		upEvent = 'touchend',
		ios = true;
	
	} else {
		var downEvent = 'mousedown',
		dragEvent = 'mousemove',
		upEvent = 'mouseup';
	}
	
	
	
	if (type == 'host'){
		boardDiv.style.height = '450px';
		boardDiv.style.width = '300px';
		boardDiv.style.float = 'left';
		boardDiv.style.margin = '10px';
		boardDiv.className = "transitions";
		
	}
	
			
	var init = function () {
		var j, i, addArr,
		addHTML = "";
		addClass = (type=="host")? 'host-table' : 'client-table';
		
		addClass += " " + "drums" ;
		
		for (i=0; i<size[1]; i++) {	
			var addArr = [];
			addHTML += '<tr>';
			
			for (j=0; j<size[0]; j++) {
				if (type == "host"){
					console.log(instrument);
					addArr.push([new AudioTrack('static/audio/'+instrument+'/'+j+'.wav',0), 0]); //audiotrack, on/off
				}
				addHTML += '<td class="off"></td>';
			}
			
			cells.push(addArr);
			addHTML += '</tr>';
			// 
		}
		
		
		boardDiv.innerHTML = "<table class='" +addClass+"'>" + addHTML + "</table>";
		
		if (type == "host"){
				boardDiv.innerHTML+= "<div class='title'>"+instrument+"</div>"
		}
		
		boardDiv.id = id;
		$('#body').append(boardDiv);
		$boardDiv = $('#'+id);
		
		
		if (type == 'client') {
			$boardDiv.on(downEvent, "td", function(event){
				currElems = [];
				mousedown = true;
				if (ios) {
					var touches = event.originalEvent.touches;
					event.originalEvent.preventDefault();
					for (var i = 0, max = touches.length; i<max;i++){
							currElems.push([document.elementFromPoint(touches[i].clientX,event.originalEvent.touches[i].clientY), touches[i].identifier]);
					}
				} else {
					currElems.push(document.elementFromPoint(event.clientX,event.clientY));
				}
				
				console.log(currElems);
				
				toggleCellProcess();
			});
			
			$boardDiv.on(upEvent, "td", function(event){
				if (ios){
					lastElem[event.originalEvent.touches[0].identifier] =  null;
				}
			
				mousedown = false;
			});

			$boardDiv.on(dragEvent, "td", function(event){
				currElems = [];
				if (ios){
					var touches = event.originalEvent.touches;
					event.originalEvent.preventDefault()
					for (var i = 0, max = touches.length; i<max;i++){
							currElems.push([document.elementFromPoint(touches[i].clientX,event.originalEvent.touches[i].clientY), touches[i].identifier]);
					}
				} else if(mousedown) {
					currElems.push(document.elementFromPoint(event.clientX,event.clientY));
				}
				
				toggleCellProcess()
							
			});
		}
	}
	
	var toggleCellProcess = function () {
		for (var i = 0, max = currElems.length; i<max; i++){
					
					if (ios){
						var id = currElems[i][1];
						currElem = currElems[i][0];
						lastElem = lastElems[id];
					} else {
						currElem = currElems[i];
						lastElem = lastElem;
					}
					if (mousedown && currElem !== lastElem && currElem.nodeName.toLowerCase() == "td"){				
						
						$elem = $(currElem);
						$elem.toggleClass('on');
						
						var $tr = $elem.parent();
						var col = $elem.index();
						var row = $tr.index();					
						
						now.sendToggleCell(col,row);
						
						if (ios){
							lastElems[id] = currElem;
							
						} else {
							lastElem = currElem;
						};
					}
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
		
		$boardDiv.find('tr').eq(row).find('td').eq(col).toggleClass('on');		
	}
	
	var deleteSelf = function () {
		if ($boardDiv){
			$boardDiv.remove();
		}
	}
	
	var position = function (x,y){
		$boardDiv.css('top',y).css('left',x);	
	}
	init();
	
	
	return {
		playLine: playLine,
		toggleCell: toggleCell,
		deleteSelf: deleteSelf,
		position: position
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

