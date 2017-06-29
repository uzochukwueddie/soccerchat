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
    
    var userImg = $('#img-user').val();

    socket.on('connect', function() {
        
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
//            console.log('Joined');
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

                if(f.indexOf(rec) > -1){
                    $('#friend-add').attr('disabled', 'disabled');
                    $('#friend-add').html('Friends');
                    $('#friend-add').removeClass('btn-primary');
                }else{
                    $('#friend-add').html('Add Friend');
                    $('#friend-add').css('background-color', '#4aa1f3');
                    $('#friend-add').css('color', 'white');
                }

                if(sentToName.indexOf(rec) > -1){
                    $('#friend-add').html('Friend Request Sent');
                    $('#friend-add').removeClass('btn-primary')
                }else if(sentToName.indexOf(rec) <= -1){
                    $('#friend-add').html('Add Friend');
                    $('#friend-add').css('background-color', '#4aa1f3');
                    $('#friend-add').css('color', 'white');
                }  
                
            });

            $(document).on('click', '#friend-add', function(){
                $('#friend-add').html('Friend Request Sent');
            })

            
        }
        
        $('#numValue').text('('+users.length+')');
        $('#users').html(ol);
    });

    socket.on('disconnect', function() {
        //console.log('Disconnected from server');
    });

    socket.on('newMessage', function(message){
        var template = $('#message-template').html();
        
        var html = Mustache.render(template, {
            text: message.text,
            from: message.from,
            userPic: message.userImage
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
    
    
    $('#message-form').on('submit', function(e){
        e.preventDefault();

        var msg = $('#msg').val();
        var clubId = $('#clubId').val();
        
        if((typeof msg === 'string' && msg.trim().length > 0)){
           socket.emit('createMessage', {
                from: sender,
                text: msg,
                room: room,
                userImg: userImg
            }, function(){
                $('#msg').val('');
            }); 
            
            AjaxRequest('/group/'+rm1+'/'+rm, msg, clubId);
        }
          
    });

    $('#msg').keypress(function(e){
         var key = e.keyCode || e.which ;
        
        var msg = $('#msg').val();
        var clubId = $('#clubId').val();
    
        if((key == 13 && typeof msg === 'string' && msg.trim().length > 0)){
           socket.emit('createMessage', {
                from: sender,
                text: msg,
                room: room,
                userImg: userImg
            }, function(){
                $('#msg').val('');
            }); 
            
            AjaxRequest('/group/'+rm1+'/'+rm, msg, clubId);
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
        
        var receiver_Name = '@'+receiverName;
        
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

function AjaxRequest(str, message, clubId=''){
    $.ajax({
        url: str,
        type: 'POST',
        data: {
            message: message,
            clubId: clubId
        },
        success: function(data){
            
        }
    });
}

























