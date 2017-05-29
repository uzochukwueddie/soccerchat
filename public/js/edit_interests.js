$(document).ready(function(){

	$(document).on('submit', '#team', function(e){
		e.preventDefault();

		var teamId = $(this).data().value;

		$.ajax({
			url:'/settings/interests',
			type: 'POST',
			data: {
				teamId: teamId
			},
			success: function(){
				setTimeout(function(){
                    window.location.reload(true);
                }, 200)
			}
		});
	});

	$(document).on('submit', '#clubs', function(e){
		//e.preventDefault();

		var clubId = $(this).data().value;

		$.ajax({
			url:'/settings/interests',
			type: 'POST',
			data: {
				clubId: clubId
			},
			success: function(){
				setTimeout(function(){
                    window.location.reload(true);
                }, 200)
			}
		});
	});

	$(document).on('submit', '#players', function(e){
		//e.preventDefault();

		var playerId = $(this).data().value;

		$.ajax({
			url:'/settings/interests',
			type: 'POST',
			data: {
				playerId: playerId
			},
			success: function(){
				setTimeout(function(){
                    window.location.reload(true);
                }, 200)
			}
		});
	});
})