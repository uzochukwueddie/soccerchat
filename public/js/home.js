$(document).ready(function(){
    // var socket = io();

    // socket.on('connect', function(){
    //     console.log('First connection');

    //     var room = 'FirstRoom'
    //     var name = $('#user-name').val()

    //     console.log(room)
    //     console.log(name)

    //     socket.emit('first room', {
    //         room: room,
    //         name: name
    //     }, function(){

    //     })
    // })

    
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
                console.log(clubName);
            }
        });
    })
    
})