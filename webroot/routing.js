var app = $.sammy('body', function() {

	this.swap = function(content) {
		this.$element().html(content).fadeIn(300);
	}

	this.get('#/', function(context) {
		var self  = this;
		this.partial('static/landing.html', function(){console.log('')},100);
		
		
		this.$element().on('click','#host', function(){
			console.log('click');
			var room = $('#host-input').val();
					
				
			if (!room){
				room = 'Testing';
			}
			
			now.room = room;
			now.joinGroup();
			
						
			$('body').load('static/host.html', function(){
				console.log('A');
				$('#logo').html(room)
				var game = CircleSession('host');
				game.start();
			});
					
		})

		this.$element().on('click','#join',function(){
			
			
			var room = $('#join-input').val(),
			instruments = {"0":'synth', "1":'drums', "2":'sax1', "3":"sax2", "4":"percussion1", "5":"percussion2"},
			instrument = instruments[$('#instrument-input').val()];
			if (!room){
				room = 'Testing';
			}
			
			now.room = room;
			now.joinGroup();
			
			
			$('body').load('static/client.html', function(){
				var game = CircleSession('client', instrument);
				game.start();
			});
			
			
	
		})
		
	});
	
});

$(window).ready(function(){
	setTimeout( function(){ window.scrollTo(0, 1); }, 10 );
	$('html').on('touchmove', function(event){
		event.originalEvent.preventDefault();
	})
});;

now.ready(function() {
	
		app.run('#/');
		
});
