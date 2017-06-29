$(document).ready(function(){
    var socket = io(); 
    
    var rm = $('#roomName').val();
    
    var sender = $('#sender').val();
    var name = $('#sender').val();

    var param = $.myDeparam(window.location.pathname);

    var room = decodeURIComponent(param);

    
    socket.on('connect', function(){
        socket.on('updateUsersList', function(users){
            var ol = $('<ol></ol>');
            
            var friend = $('.friend').text();
            var f = friend.split('@');
            
            var getUsername = $('#sender').val()
            
            for(var i = 0; i < users.length; i++){
                   
                if(f.indexOf(users[i]) > -1){ 
                    ol.append($('<p><a id="val">'+users[i]+'</a> <span class="bl"> (Friends) </span></p>'));
                }else{
                    if(getUsername === users[i]){
                        ol.append($('<p><a id="val">'+users[i]+'</a> <span class="bl"> (You) </span></p>'));
                    }else{
                        ol.append($('<p><a id="val">'+users[i]+'</a> <span class="bl"> </span> </p>'));
                    }
                    
                }
                
                $(document).on("click", "#val", function(){
                    $('#receiverName').val($(this).text());
                    $("#nameLink").attr("href", "/profile/"+$(this).text());
                    $('#name').text($(this).text());
        
                    var receiverName = $('#receiverName').val();
                    var sendername = $('#sender-name').val();
                        
                    var params = {
                        sender: sendername,
                        receiver: receiverName
                    }

                    socket.emit('requestJoin', params, function(err){
//                        console.log(params)
                    });

                    
                });

            }
            
            $('#numValue').text('('+users.length+')');
            $('#users').html(ol);
        });
    })

    socket.on('newFriendRequest', function(friend){

//        console.log(friend)
    });

});


function swap(input, index_A, index_B) {
    var temp = input[index_A];
 
    input[index_A] = input[index_B];
    input[index_B] = temp;
}

function openNav() {
    document.getElementById("mySidenav").style.width = "350px";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}



























