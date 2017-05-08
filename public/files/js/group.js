//$(document).ready(function(){
//    var socket = io(); 
//    
//    
//    var rm = $('#roomName').val();
//    
//    
//    
//    var sender = $('#sender').val();
//    var name = $('#sender').val();
//
//    var param = $.myDeparam(window.location.pathname);
//
//    var room = decodeURIComponent(param);
//
//    socket.on('connect', function() {
//        console.log('Connected to server');
//        
//        var params = {
//            room: room,
//            name: name
//        }
//        
//        
//        socket.emit('join', params, function(err){
//            console.log(params)
//        });
//        
//    });
//    
//    socket.on('updateUsersList', function(users){
//        var ol = $('<ol></ol>');
//        
////        console.log(users)
//        
////        var room = $('#roomName').val();
////        var sender_name = $('#sender').val();
////        var senderName = sender_name.replace(/ /g, "-")
//        
//        var list = $('');
//
//        users.forEach(function(user){
//            var nameParams = user.replace(/ /g,"-");
//            ol.append($('<li><button id="val" data-toggle="modal" data-target="#user">'+user+'</button></li>'));
//            
//            $(document).on("click", "#val", function(){
////                console.log($(this).text());
//                 $('#receiverName').val($(this).text());
//            })
//            
//        });
//        
//        $('#users').html(ol);
//    });
//
//    socket.on('disconnect', () => {
//        console.log('Disconnected from server');
//    });
//
//    socket.on('newMessage', function(message){
//        var template = $('#message-template').html();
//        
//        var html = Mustache.render(template, {
//            text: message.text,
//            from: message.from
//        });
//
//        $('#messages').append(html);
//        
//    });
//    
//    
//    $('#message-form').on('submit', function(e){
//        e.preventDefault();
//        
//        var msg = $('#msg').val();
//        
//        socket.emit('createMessage', {
//                from: sender,
//                text: msg,
//                room: room
//            }, function(){
//                console.log('Got it!!!');
//                $('#msg').val('');
//            });
//        
//        
//    });
//    
//    $('#add_friend').on('submit', function(e){
//        e.preventDefault();
//        
//        var receiverName = $('#receiverName').val();
//        
//        
//        $.ajax({
//            url: '/group/'+rm,
//            type: 'POST',
//            data: {
//                receiverName: receiverName
//            },
//            success: function(data){
//                
//            }
//        });
//        
//        
//    });
//    
//    $('#accept_friend').on('click', function(){
//        
//        var senderId = $('#senderId').val();
//        var senderName = $('#senderName').val();
//        var username = $('#user_name').val();
//        
//        
//        $(this).remove();
//        $('#cancel_friend').remove();
//        $('#senderName').remove();
//        
//        
//        $.ajax({
//            url: '/chat/'+rm,
//            type: 'POST',
//            data: {
//                senderId: senderId,
//                senderName: senderName,
//                username: username
//            },
//            success: function(data){
//                
//            }
//        })
//        
//        setTimeout(function(){
////            $('.request').load(location.href + ' .request');
//            window.location.reload(true);
//        }, 200);
//    });
//    
//    $('#cancel_friend').on('click', function(){
//        
//        var user_Id = $('#user_Id').val();
//        var rmm = $('#roomName').val();
//        
//        $(this).remove();
//        $('#accept_friend').remove();
//        $('#senderName').remove();
//        
//        
//        $.ajax({
//            url: '/chat/'+rmm,
//            type: 'POST',
//            data: {
//                user_Id: user_Id
//            },
//            success: function(data){
//                
//            }
//        });
//        
//        
//        setTimeout(function(){
////            $('.request').load(location.href + ' .request');
//            window.location.reload(true);
//        }, 200);
//    });
//
//});
//
//function swap(input, index_A, index_B) {
//    var temp = input[index_A];
// 
//    input[index_A] = input[index_B];
//    input[index_B] = temp;
//}
//
//function openNav() {
//    document.getElementById("mySidenav").style.width = "250px";
//}
//
///* Set the width of the side navigation to 0 */
//function closeNav() {
//    document.getElementById("mySidenav").style.width = "0";
//}