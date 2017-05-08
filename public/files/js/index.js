$(document).ready(function(){

    $('#join').on('click', function() {
        console.log('Button Clicked');
        
        var name = $('#name').val();
        var room = $('#room').val();
        
        var params = {
            name: name,
            room: room
        };
        
        $.ajax({
            url: '/chat',
            type: 'POST',
            data: params,
            success: function(data){
                $('#name').val('');
                $('#room').val('');
            }
        });
    });


});