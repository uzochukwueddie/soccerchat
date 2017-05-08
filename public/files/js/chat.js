$(document).ready(function(){
    var socket = io(); 
    
    var rm = $('#roomName').val();
    
    var sender = $('#sender').val();
    var name = $('#sender').val();

    var param = $.myDeparam(window.location.pathname);

    var room = decodeURIComponent(param);

    socket.on('connect', function() {
        console.log('Connected to server');
        
        var params = {
            room: room,
            name: name
        }
        
        
        socket.emit('join', params, function(err){
            console.log(params)
        });
        
    });
    
    socket.on('updateUsersList', function(users){
        var ol = $('<ol></ol>');
        
        var friend = $('.friend').text();
        var f = friend.split('@');
        
        var getUsername = $('#sender').val()
        
        for(var i = 0; i < users.length; i++){
               
            if(f.indexOf(users[i]) > -1){
                
                ol.append($('<li><a id="val">'+users[i]+'</a> (Friends)</li>'));
            }else{
                if(getUsername === users[i]){
                    ol.append($('<li><a id="val">'+users[i]+'</a> (You)</li>'));
                }else{
                    ol.append($('<li><a id="val">'+users[i]+'</a> </li>'));
                }
                
            }
            
            $(document).on("click", "#val", function(){
                $('#receiverName').val($(this).text());
                $("#nameLink").attr("href", "/profile/"+$(this).text());
                $('#name').text($(this).text());
            });
        }
        
        $('#numValue').text('('+users.length+')');
        $('#users').html(ol);
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from server');
    });

    socket.on('newMessage', function(message){
        var template = $('#message-template').html();
        
        var html = Mustache.render(template, {
            text: message.text,
            from: message.from
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
    
    
    $('#message-form').on('submit', function(e){
        e.preventDefault();
        
        var msg = $('#msg').val();
        
        socket.emit('createMessage', {
            from: sender,
            text: msg,
            room: room
        }, function(){
            console.log('Got it!!!');
            $('#msg').val('');
            $('.emoji-wysiwyg-editor').text('')
        });  
    });
    
    $(document).on('click', '#clickBtn', function(){
        var className = $(this).attr('class');
        $('#friendName').val(className);
//        $('#friend_Name').text(className);
    });
    
    $('#add_friend').on('submit', function(e){
        e.preventDefault();
        
        var receiverName = $('#receiverName').val();
        console.log(receiverName)
        
        
        $.ajax({
            url: '/group/'+rm,
            type: 'POST',
            data: {
                receiverName: receiverName
            },
            success: function(data){
                setTimeout(function(){
                    window.location.reload(true);
                }, 200);
            }
        });
    });
    
    $('#accept_friend').on('click', function(){
        
        var senderId = $('#senderId').val();
        var senderName = $('#senderName').val();
        
        
        $(this).remove();
        $('#cancel_friend').remove();
        $('#senderName').remove();
        
        
        $.ajax({
            url: '/group/'+rm,
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
            url: '/group/'+rm,
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
    
//    setInterval(function(){
//        $('#notificationContainer').load(location.href + ' #notificationContainer');
//    }, 7000);

});

function swap(input, index_A, index_B) {
    var temp = input[index_A];
 
    input[index_A] = input[index_B];
    input[index_B] = temp;
}

function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
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

// function linkify(inputText) {
//     var replacedText, replacePattern1, replacePattern2, replacePattern3, replacePattern4;

//     //URLs starting with http://, https://, or ftp://
//     replacePattern1 = /(\b(https?|http?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
//     replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

//     //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
//     replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
//     replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

//     //Change email addresses to mailto:: links.
//     replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
//     replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

//     return replacedText;
// }

























