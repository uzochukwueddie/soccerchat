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
                url: '/settings/profile',
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
                url: '/settings/profile',
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
            url: '/settings/profile',
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
            url: '/settings/profile',
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

    $('#click_link').on('click', function(e){
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

    $('.add-btn').on('click', function(){
        $('#add-input').click();
    });

    $('#add-input').on('change', function(){
        var addInput = $('#add-input');
//        var club = $('#soccerclub')
        
        if(addInput.val() != ''){
            var formData = new FormData();
            
            formData.append('upload', addInput[0].files[0]);

            $('#completed').html('File Uploaded');
            
            $.ajax({
                url: '/userupload',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(data){
                    addInput.val('');
                }
            })
        }
    });

    
    $('#profile').on('click', function(e){
        //e.preventDefault()
        
        var fullname = $('#fullname').val();
        var city = $('#city').val();
        var description = $('#description').val();
        var gender = $('#gender').val();
        var userImage = $('#add-input').val();
        var image_user = $('#image_user').val();
		var club = $('#club').val();
        
        var valid = true;

        if($('#add-input').val() == ''){
            $('#add-input').val($('#image_user').val())
        }
        
        if(fullname == '' || city == '' || description == '' || club == ''){
            valid = false;
            $('#error').html('<div class="alert alert-danger">You cannot submit an empty form field</div>');
        }else{
            userImage = $('#add-input').val();
            $('#error').html('');
        }
        
        if(valid == true){
            $.ajax({
                url: '/settings/profile',
                type: 'POST',
                data: {
                    fullname: fullname,
                    city: city,
                    description: description,
                    gender: gender,
                    userImage: userImage,
					club: club
                },
                success: function(data){
                    $('#fullname').val('');
                    $('#city').val('');
                    $('#description').val('');

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