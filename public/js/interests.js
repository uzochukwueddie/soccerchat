$(document).ready(function(){
    var socket = io(); 

    var names = $('#chat_names').val();

    socket.on('connect', function() {

        socket.on('my message', function(message){
            $('#re_load2').load(window.location.href + ' #re_load2');
        })        
    });

    socket.on('newFriendRequest', function(friend, fn){

        $('#re_load2').load(location.href + ' #re_load2');

        $(document).on('click', '#accept_friend', function(){
        
            var senderId = $('#senderId').val();
            var senderName = $('#senderName').val();
            
            
            $.ajax({
                url: '/settings/interests',
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
                url: '/settings/interests',
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

    $('#accept_friend').on('click', function(){
        
        var senderId = $('#senderId').val();
        var senderName = $('#senderName').val();
        
        
        $.ajax({
            url: '/settings/interests',
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
            url: '/settings/interests',
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

    $('#link_click').on('click', function(e){
        //e.preventDefault();

        var chatId = $(this).data().value;

        $.ajax({
            url: '/chat/'+names,
            type: 'POST',
            data: {
                chatId: chatId
            },
            success: function(){
                
            }
        });
    });

//..............................................................................................................
    
    $('#nationalTeam').on('click', function(e){
        e.preventDefault()
        
        var national = $('#national').val();
        
        var valid = true;
        
        if(national == ''){
            valid = false;
            $('#error').html('<div class="alert alert-danger">Favourite national team field cannot be empty.</div>');
        }else{
            $('#error').html('');
        }
        
        if(valid == true){
            $.ajax({
                url: '/settings/interests',
                type: 'POST',
                data: {
                    national: national
                },
                success: function(data){
//                    $('#fullname').val('');
                    setTimeout(function(){
                        window.location.reload(true);
                    }, 200)
                }
            });
        }else{
            return false;
        }
    });
    
    $('#favClubBtn').on('click', function(e){
        e.preventDefault()
        
        var favClub = $('#favClub').val();
        
        var valid = true;
        
        if(national == ''){
            valid = false;
            $('#error').html('<div class="alert alert-danger">Favourite clubs field cannot be empty.</div>');
        }else{
            $('#error').html('');
        }
        
        if(valid == true){
            $.ajax({
                url: '/settings/interests',
                type: 'POST',
                data: {
                    favClub: favClub
                },
                success: function(data){
//                    $('#fullname').val('');
                    setTimeout(function(){
                        window.location.reload(true);
                    }, 200)
                }
            });
        }else{
            return false;
        }
    });
    
    $('#favPlayersBtn').on('click', function(e){
        e.preventDefault()
        
        var favPlayers = $('#favPlayers').val();
        
        var valid = true;
        
        if(national == ''){
            valid = false;
            $('#error').html('<div class="alert alert-danger">Favourite clubs field cannot be empty.</div>');
        }else{
            $('#error').html('');
        }
        
        if(valid == true){
            $.ajax({
                url: '/settings/interests',
                type: 'POST',
                data: {
                    favPlayers: favPlayers
                },
                success: function(data){
                    setTimeout(function(){
                        window.location.reload(true);
                    }, 200)
                }
            });
        }else{
            return false;
        }
    })
    
})