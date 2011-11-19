var app = $.sammy('body', function() {

	this.swap = function(content) {
		this.$element().hide(0).html(content).fadeIn(300);
	}

	this.get('#/', function(context) {
		this.partial('static/landing.html');
	});

	this.get('#/client/room/:id', function(context) {
		this.swap('client');
		var game = CircleSession('client');
		game.start();
	});
	
	this.get('#/host/room/:id', function(context) {
		this.swap('host: '+this.params['id']);
		var game = CircleSession('host');
		game.start();
	});
	
	this.notFound('get','#/');
});

$(document).ready(function() {
		app.run('#/');
		
});
