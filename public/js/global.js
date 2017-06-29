$(document).ready(function(){
    var socket = io();

    socket.on('connect', function(){

        var room = 'FirstRoom';
        var name = $('#name-user').val();
        var img = $('#img-user').val();
        
        socket.emit('first room', {
            room: room,
            name: name,
            img: img
        }, function(){

        });
    });

    socket.on('loggedInUser', function(users){
        var friend = $('.friend').text();
        var f = friend.split('@');

        var name = $('#name-user').val()

        var ol = $('<div></div>');
        var arr = [];

        for(var i = 0; i < users.length; i++){
            if(f.indexOf(users[i].name) > -1){
                arr.push(users[i]);
                var list = '<img src="https://soccerchatuser.s3.amazonaws.com/'+users[i].img+'" class="pull-left img-circle" style="width:50px;margin-right:10px" /><p>' +
                '<a id="val" href="/chat/@'+users[i].name+'@'+name+'"><h3 style="padding-top:15px;color:gray;font-size:14px">'+'@'+users[i].name+'<span class="fa fa-circle online_friend"></span></h3></a></p>' +
                '<div class="clearfix"></div><hr style=" margin-top: 14px; margin-bottom: 14px;" />'
                ol.append($(list));
            }
        }

        $('#numOfFriends').text('('+arr.length+')');
        $('.onlineFriends').html(ol)
    })
    
})