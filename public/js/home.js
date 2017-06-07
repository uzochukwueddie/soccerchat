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
                url: '/home',
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
                url: '/home',
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
            url: '/home',
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
            url: '/home',
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

//....................................................................................................................

    
    $('#add_fav').on('submit', function(e){
        e.preventDefault()
        
        var id = $('#id').val();
        var clubName = $('#club_Name').val();
        
        $.ajax({
            url: '/home',
            type: 'POST',
            data: {
                id: id,
                clubName: clubName
            },
            success: function(data){
                
            }
        });
    })
    
})