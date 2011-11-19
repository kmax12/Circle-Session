$('#host').click(function(){
	var room = $(this).val();
	
	console.log(room);
	
	if (!room){
		room = 'testing';
	}
	
	window.location.href = '#/host/room/' + room;
})

$('#join').click(function(){
	var room = $(this).val();
	
	if (!room){
		room = 'testing';
	}
	
	window.location.href = '#/client/room/' + room;
})

