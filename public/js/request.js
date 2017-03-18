$(document).ready(function(){
    var socket = io(); 
    
    var sender = $('#sender').val();

//    var param = $.myDeparam(window.location.pathname);
//    var room = decodeURIComponent(param);
    
    
    var room = $('#room_name').val()

    var roomSplit = room.split('@');
    swap(roomSplit, 1, 2);

    var room1 = '@'+roomSplit[1]+'@'+roomSplit[2]

    socket.on('connect', function() {
        console.log('Connected to PM server');
        
        var newParams = {
            room: room,
            room1: room1,
            name: sender
        }
        
        socket.emit('joinPM', newParams, function(err){
            console.log(newParams)
        });
        
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from server');
    });

    socket.on('newMessage', function(message){
        var template = $('#message-template').html();
        
//        setTimeout(function(){ 
//            $('#notify').text(message.text); 
//        }, 10000);
        
        var html = Mustache.render(template, {
            text: message.text,
            from: message.from,
            createdAt: moment(message.createdAt).format('LT')
        });

        $('#messages').append(html);

        $('.userText').linkify({
            tagName: 'a', // The tag that should be used to wrap each URL. This is useful for cases where a tags might be innapropriate, or might syntax problems
            newLine: '\n', // The character to replace new lines with. Replace with "<br>" to space out multi-line user content.
            target: '_blank', // target attribute for each linkified tag.
            linkClass: null, // The class to be added to each linkified tag. The extra .linkified class ensures that each link will be clickable, regardless of the value of tagName.
            linkClasses: [],
            linkAttributes: { // HTML attributes to add to each linkified tag. In the following example, the tabindex and rel attributes will be added to each link.
            tabindex: 0,
            rel: 'nofollow'
            } 
        });
        
        scrollToBottom();
        
    });
    
    
    $('#message_form').on('submit', function(e){
        e.preventDefault();
        
        var msg = $('#message').val();
        
        socket.emit('private message', {
            from: sender,
            text: msg,
            room: room,
            room1: room1
        }, function(){
            $('#message').val('')
        });
        
    });
    
    $('#chatMessage').on('click', function(e){
//        e.preventDefault();
        
        var roomName = $('#room_name').val();
        var message = $('#message').val();
        
        $.ajax({
            url: '/chat/'+roomName,
            type: 'POST',
            data: {
                message: message
            },
            success: function(data){
                $('#message').val('')
            }
        })
        
    });
    
//    $('#accept_friend').on('click', function(){
//        
//        var userId = $('#userId').val();
//        var userName = $('#userName').val();
//        var username = $('#user_name').val();
//        var rm = $('#roomName').val();
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
//                userId: userId,
//                userName: userName,
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
    
    $('#accept_friend').on('click', function(){
        
        var senderId = $('#senderId').val();
        var senderName = $('#senderName').val();
        
        
        $(this).remove();
        $('#cancel_friend').remove();
        $('#senderName').remove();
        
        
        $.ajax({
            url: '/chat/'+room1,
            type: 'POST',
            data: {
                senderId: senderId,
                senderName: senderName
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
                
            }
        });
        
        
        setTimeout(function(){
            window.location.reload(true);
        }, 200);
    });
    
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

});

function swap(input, index_A, index_B) {
    var temp = input[index_A];
 
    input[index_A] = input[index_B];
    input[index_B] = temp;
}

function scrollToBottom(){
  var messages = $("#messages");
  var newMessage = messages.children('li:last-child');

  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
    messages.scrollTop(scrollHeight);
  }

}