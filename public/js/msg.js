$(document).ready(function(){
    var socket = io(); 
    
    var sender = $('#sender').val();
    
    
    var room = $('#room_name').val()

    var roomSplit = room.split('@');
    swap(roomSplit, 1, 2);

    var room1 = '@'+roomSplit[1]+'@'+roomSplit[2]

    socket.on('connect', function() {
        
        var newParams = {
            room: room,
            room1: room1,
            name: sender
        }
        
        socket.emit('joinMessage', newParams, function(err){
//            console.log(newParams)
        });
        
    });

    socket.on('disconnect', () => {
//        console.log('Disconnected from server');
    });

    socket.on('newMessage', function(message){
        var template = $('#message-template').html();
        
        var html = Mustache.render(template, {
            text: message.text,
            from: message.from
        });

        $('#messages').append(html);
        
    });
    
    
    $('#message_form').on('submit', function(e){
        e.preventDefault();
        
        var msg = $('#message').val();
        
        socket.emit('message', {
            from: sender,
            text: msg,
            room: room,
            room1: room1
        }, function(){
            $('#message').val('')
        });
        
    });
    
    $('#accept_friend').on('click', function(){
        
        var userId = $('#userId').val();
        var userName = $('#userName').val();
        var username = $('#user_name').val();
        var rm = $('#roomName').val();
        
        $(this).remove();
        $('#cancel_friend').remove();
        $('#senderName').remove();
        
        
        $.ajax({
            url: '/chat/'+rm,
            type: 'POST',
            data: {
                userId: userId,
                userName: userName,
                username: username
            },
            success: function(data){
                
            }
        })
        
        setTimeout(function(){
            window.location.reload(true);
        }, 200);
    });
    
    $('#cancel_friend').on('click', function(){
        
        var user_Id = $('#user_Id').val();
        var rmm = $('#roomName').val();
        
        $(this).remove();
        $('#accept_friend').remove();
        $('#senderName').remove();
        
        
        $.ajax({
            url: '/chat/'+rmm,
            type: 'POST',
            data: {
                user_Id: user_Id
            },
            success: function(data){
                
            }
        });
        
        
        setTimeout(function(){
//            $('.request').load(location.href + ' .request');
            window.location.reload(true);
        }, 200);
    });

});

function swap(input, index_A, index_B) {
    var temp = input[index_A];
 
    input[index_A] = input[index_B];
    input[index_B] = temp;
}