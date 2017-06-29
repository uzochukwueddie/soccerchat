module.exports = (io) => {
    //io.on lets you register an event listener
    //Connection lets you listen for a new connection
    io.on('connection', (socket) => {

        socket.on('joinRequest', (myRequest, callback) => {
            socket.join(myRequest.room);
            socket.join(myRequest.room1);
        });

        socket.on('friendRequest', function(friend, callback){
              io.to(friend.room).emit('newFriendRequest', {});

            callback();
        });
    })
}




























