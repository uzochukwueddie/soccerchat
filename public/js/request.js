$(document).ready(function(){
    var socket = io(); 
    
    var sender = $('#sender').val();
    
    
    var room = $('#room_name').val()

    var roomSplit = room.split('@');
    swap(roomSplit, 1, 2);

    var room1 = '@'+roomSplit[1]+'@'+roomSplit[2];
    
    var userImg = $('#user_img').val();

    socket.on('connect', function() {
//        console.log('Connected to PM server');
        
        var newParams = {
            room: room,
            room1: room1,
            name: sender,
            receiver: '@'+roomSplit[2]
        }
        
        socket.emit('joinPM', newParams, function(err){
//            console.log('Sent!!!')
        });

        socket.on('my message', function(message){
            $('#re_load2').load(location.href + ' #re_load2');
        });
        
    });

    socket.on('disconnect', () => {
//        console.log('Disconnected from server');
    });

    socket.on('new PM message', function(message){

        var template = $('#message-template').html();
        
        var html = Mustache.render(template, {
            text: message.text,
            from: message.from,
            userPic: message.userImage,
            createdAt: moment(message.createdAt).format('LT')
        });

        $('#messages').append(html);
        
        scrollToBottom();
        
    });

    socket.on('my message', function(message){
        $('#re_load2').load(location.href + ' #re_load2');
    });

    socket.on('new refresh', function(){
        $('#re_load2').load(location.href + ' #re_load2');
    });

    if(room){
        $('#span_lable').empty();
    } 
    
    
    $('#message_form').on('submit', function(e){
        e.preventDefault();
        
        var msg = $('#msg').val();
        
        if((typeof msg === 'string' && msg.trim().length > 0)){
            socket.emit('private message', {
                from: sender,
                text: msg,
                room: room,
                room1: room1, 
                userImg: userImg
            }, function(){
                $('#msg').val('')
            });
        }
        
    });

    $("#msg").focusin(function() {

        var chat_id = $(this).data().value;

        $.ajax({
            url: '/chat/'+room1,
            type: 'POST',
            data: {
                chat_id: chat_id
            },
            success: function(){
                
                $('#re_load2').load(location.href + ' #re_load2');
            }
        });
            
    })

    $('#msg').keypress(function(e){

        var key = e.keyCode || e.which;
        
        var msg = $('#msg').val();
    
        if((key == 13 && typeof msg === 'string' && msg.trim().length > 0)){
           socket.emit('private message', {
                from: sender,
                text: msg,
                room: room,
                userImg: userImg
            }, function(){
//                console.log('Got it!!!');
                $('#msg').val('');
            }); 

           var roomName = $('#room_name').val();
            var message = $('#msg').val();
            
            $.ajax({
                url: '/chat/'+roomName,
                type: 'POST',
                data: {
                    message: message
                },
                success: function(data){
                    $('#msg').val('')
                }
            })
        }
    });
    
    $('#chatMessage').on('click', function(e){
//        e.preventDefault();
        
        var roomName = $('#room_name').val();
        var message = $('#msg').val();
        
        $.ajax({
            url: '/chat/'+roomName,
            type: 'POST',
            data: {
                message: message
            },
            success: function(data){
                $('#msg').val('')
            }
        })
        
    });
    
    $('#accept_friend').on('click', function(){
        
        var senderId = $('#senderId').val();
        var senderName = $('#senderName').val();
        
        
        $.ajax({
            url: '/chat/'+room1,
            type: 'POST',
            data: {
                senderId: senderId,
                senderName: senderName
            },
            success: function(data){
                $(this).parent().eq(1).remove();
            }
        })
        
        $('#re_load2').load(location.href + ' #re_load2');
    });
    
    $('#cancel_friend').on('click', function(){
        
        var user_Id = $('#user_Id').val();
//        var rmm = $('#roomName').val();
        
        $(this).remove();
        $('#accept_friend').remove();
        $('#senderName').remove();
        
        
        $.ajax({
            url: '/chat/'+room1,
            type: 'POST',
            data: {
                user_Id: user_Id
            },
            success: function(data){
                $(this).parent().eq(1).remove();
            }
        });
        
        $('#re_load2').load(location.href + ' #re_load2');
    });

    $(document).on('click', '#link_click', function(e){
        //e.preventDefault();

        var chatId = $(this).data().value;

        var new_params = {
            room: room,
            room1: room1
        }

        $.ajax({
            url: '/chat/'+room1,
            type: 'POST',
            data: {
                chatId: chatId
            },
            success: function(){
                
            }
        });

        socket.emit('refresh div', new_params, function(){
            //console.log('Good to go')
        });
        
    });

});

function swap(input, index_A, index_B) {
    var temp = input[index_A];
 
    input[index_A] = input[index_B];
    input[index_B] = temp;
}

function scrollToBottom(){
    $('.chat_area').scrollTop($('.chat_area')[0].scrollHeight);
}
