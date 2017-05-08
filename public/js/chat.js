$(document).ready(function(){
    var socket = io(); 
    
    var rm = $('#roomName').val();
    
    var sender = $('#sender').val();
    var name = $('#sender').val();


    var param = $.myDeparam(window.location.pathname);

    var room = decodeURIComponent(param);

    var param1 = $.myDeparam2(window.location.pathname);

    var rm1 = param1;
    var rm2 = '@'+sender;

    socket.on('connect', function() {
        //console.log('Connected to server');
        
        var params = {
            room: room,
            name: name
        }

        var params1 = {
            room: rm1,
            room1: rm2
        }
        
        
        socket.emit('join', params, function(err){
            //console.log(params)
        });

        socket.emit('joinRequest', params1, function(err){
            console.log('Joined');
        });

        socket.on('my message', function(message){
            $('#re_load2').load(window.location.href + ' #re_load2');
        })

        
    });


    socket.on('updateUsersList', function(users){
        var ol = $('<ol id="list"></ol>');
        
        var friend = $('.friend').text();
        var f = friend.split('@');
        
        var getUsername = $('#sender').val();

        var sentTo = $('.sentTo').text();
        var sentToName = sentTo.split('@');
        

        for(var i = 0; i < users.length; i++){
               
            if(f.indexOf(users[i]) > -1){ 
                ol.append($('<p id="val2"><a id="val" data-toggle="modal" data-target="#myModal">'+users[i]+'</a> <span class="bl"> (Friends) </span></p>'));
            }else{
                if(getUsername === users[i]){
                    ol.append($('<p id="val2"><a id="val" data-toggle="modal" data-target="#myModal">'+users[i]+'</a> <span class="bl"> (You) </span></p>'));

                }else{
                    ol.append($('<p id="val2"><a id="val" data-toggle="modal" data-target="#myModal">'+users[i]+'</a> <span class="bl"> </span> </p>'));
                }
                
            }
            
            
            $(document).on("click", "#val", function(){
                $('#receiverName').val($(this).text());
                $("#nameLink").attr("href", "/profile/"+$(this).text());
                $('#name').text('@'+$(this).text());

                var rec = $('#receiverName').val();

                if(f.indexOf(rec) > -1 || f.indexOf(getUsername) > -1){
                    $('#friend-add').attr('disabled', 'disabled');
                    $('#friend-add').html('Friends');
                    $('#friend-add').removeClass('btn-primary')
                }

                if(sentToName.indexOf(rec) > -1){
                    $('#friend-add').html('Friend Request Sent');
                    $('#friend-add').removeClass('btn-primary')
                }  
                
            });

            
        }
        
        $('#numValue').text('('+users.length+')');
        $('#users').html(ol);
    });

    socket.on('disconnect', function() {
        console.log('Disconnected from server');
    });

    socket.on('newMessage', function(message){
        var template = $('#message-template').html();
        
        var html = Mustache.render(template, {
            text: message.text,
            from: message.from,
        });

        $('#messages').append(html);
        
        scrollToBottom();
        
    });

    socket.on('newFriendRequest', function(friend, fn){

        $('#re_load2').load(location.href + ' #re_load2');

        $(document).on('click', '#accept_friend', function(){
        
            var senderId = $('#senderId').val();
            var senderName = $('#senderName').val();
            
            
            $.ajax({
                url: '/group/'+'@'+rm1+'/'+rm,
                type: 'POST',
                data: {
                    senderId: senderId,
                    senderName: senderName
                },
                success: function(data){
                    $('#main_scroll').load(window.location.href + ' #main_scroll');
                    $(this).parent().eq(1).remove();
                }
            });

            $('#re_load2').load(location.href + ' #re_load2');
        });
        

        $(document).on('click', '#cancel_friend', function(e){
            e.preventDefault();
        
            var user_Id = $('#user_Id').val();            
            
            $.ajax({
                url: '/group/'+'@'+rm1+'/'+rm,
                type: 'POST',
                data: {
                    user_Id: user_Id
                },
                success: function(data){
                    $(this).parent().eq(1).remove();
                }
            });

            $('#re_load2').load(window.location.href + ' #re_load2');
        });

    });

    socket.on('my message', function(message){
        $('#re_load2').load(location.href + ' #re_load2');
    });

    //setInterval(function(){
        //$('#main_scroll').load(window.location.href + ' #main_scroll');
    //}, 2000);


    
    
    $('#message-form').on('submit', function(e){
        e.preventDefault();

        var msg = $('#msg').val();
        
        if((typeof msg === 'string' && msg.trim().length > 0)){
           socket.emit('createMessage', {
                from: sender,
                text: msg,
                room: room
            }, function(){
                console.log('Got it!!!');
                $('#msg').val('');
            }); 
        }
          
    });

    $('#msg').keypress(function(e){
         var key = event.keyCode || event.which;
        
        var msg = $('#msg').val();
    
        if((key == 13 && typeof msg === 'string' && msg.trim().length > 0)){
           socket.emit('createMessage', {
                from: sender,
                text: msg,
                room: room
            }, function(){
                console.log('Got it!!!');
                $('#msg').val('');
            }); 
        }
    });
    
    $(document).on('click', '#clickBtn', function(){
        var className = $(this).attr('class');
        $('#friendName').val(className);
    });
    
    $('#add_friend').on('submit', function(e){
        e.preventDefault();
        
        var receiverName = $('#receiverName').val();
        var sender_name = '@'+$('#sender-name').val();        
        
        // var sender_Name = '@'+sender_name;
        var receiver_Name = '@'+receiverName

        
        
        $.ajax({
            url: '/group/@'+receiverName+'/'+rm,
            type: 'POST',
            data: {
                receiverName: receiverName
            },
            success: function(data){

                socket.emit('friendRequest', {
                    room: receiver_Name,
                    room1: sender_name
                }, function(){
                    console.log('Sent man!!!');
                })
            }
        });

        
    });
    
    $('#accept_friend').on('click', function(){
        
        var senderId = $('#senderId').val();
        var senderName = $('#senderName').val();
        
        
        $.ajax({
            url: '/group/'+'@'+receiverName+'/'+rm,
            type: 'POST',
            data: {
                senderId: senderId,
                senderName: senderName
            },
            success: function(data){
                $(this).parent().eq(1).remove();
            }
        });

        $('#re_load2').load(location.href + ' #re_load2');
    });
    
    $('#cancel_friend').on('click', function(){
        
        var user_Id = $('#user_Id').val();
        
        
        $.ajax({
            url: '/group/'+'@'+receiverName+'/'+rm,
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

        var chatId = $(this).data().value

        $.ajax({
            url: '/group/'+'@'+receiverName+'/'+rm,
            type: 'POST',
            data: {
                chatId: chatId
            },
            success: function(){
                
            }
        });

        // setTimeout(function(){
        //     $('#re_load2').load(location.href + ' #re_load2');
        // }, 1000);
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

























