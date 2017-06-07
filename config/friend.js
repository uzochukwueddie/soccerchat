var {generateMessage} = require('./message');
var {isRealString} = require('./validation');
var {Users} = require('./users');

var users = new Users();
var clients = new Users();
var num1 = [];

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




























