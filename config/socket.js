var {Users} = require('./users');
var users = new Users();

module.exports = (io) => {
    //io.on lets you register an event listener
    //Connection lets you listen for a new connection
    io.on('connection', (socket) => {
        socket.on('join', (params, callback) => {
            
            socket.join(params.room);
            users.removeUser(socket.id);

            users.addUser(socket.id, params.name, params.room);
                        
            io.to(params.room).emit('updateUsersList', users.getUserList(params.room));
            
            callback();
        });
        
        socket.on('createMessage', (message, callback) => {
            io.to(message.room).emit('newMessage', {
                from: message.from,
                text: message.text,
                room: message.room,
                userImage: message.userImg,
            })
            
            
            callback();
        });
        
        
        socket.on('disconnect', () => {
            var user = users.removeUser(socket.id);

            if(user){
              io.to(user.room).emit('updateUsersList', users.getUserList(user.room));
            }
        })
    })
}



























