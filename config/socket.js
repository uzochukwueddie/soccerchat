var {generateMessage} = require('./message');
var {isRealString} = require('./validation');
var {Users} = require('./users');

var users = new Users();
var clients = new Users();

module.exports = (io) => {
    //io.on lets you register an event listener
    //Connection lets you listen for a new connection
    io.on('connection', (socket) => {
       // console.log('New Connection');
        
        socket.on('join', (params, callback) => {
            
            socket.join(params.room);
            users.removeUser(socket.id);

            users.addUser(socket.id, params.name, params.room);
                        
            io.to(params.room).emit('updateUsersList',users.getUserList(params.room));
            
            //socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`, params.room));
            
            callback();
        });
        
        socket.on('createMessage', (message, callback) => {
            
            io.to(message.room).emit('newMessage', {
                from: message.from,
                text: message.text,
                room: message.room
            })
            
            
            callback();
        });
        
        
        socket.on('disconnect', () => {
//            console.log('User disconnected');
            var user = users.removeUser(socket.id);

            // console.log('Disconnected')

            //setTimeout(function(){
                if(user){
                  io.to(user.room).emit('updateUsersList', users.getUserList(user.room));
                  //io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`))
                }
            //}, 5000);
        })
    })
}



























