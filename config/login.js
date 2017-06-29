var {Users} = require('./users');
var clients = new Users();

var _ = require('underscore');

module.exports = (io) => {
    //io.on lets you register an event listener
    //Connection lets you listen for a new connection
    io.on('connection', (socket) => {
        socket.on('first room', (first, callback) => {
            
            socket.join(first.room);

            var name = clients.getRoomList(first.room);
            var arr = _.uniq(name, 'name');
            
            clients.enterRoom(socket.id, first.name, first.room, first.img);
            
            io.to(first.room).emit('loggedInUser', arr);

            callback();
        });
    })
}



























