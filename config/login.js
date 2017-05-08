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
        
        socket.on('first room', (first, callback) => {
            
            socket.join(first.room);
            //clients.removeRoom(first.name)

            var name = clients.getRoomList(first.room)

            if(name.indexOf(first.name) == -1){
                clients.enterRoom(socket.id, first.name, first.room);    
            }

            io.to(first.room).emit('loggedInUser', clients.getRoomList(first.room));

            callback();
        });
        
                
        
        // socket.on('disconnect', () => {
        //     var user = users.removeUser(socket.id);

        //         if(user){
        //           io.to(user.room).emit('updateUsersList', users.getUserList(user.room));
        //           //io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`))
        //         }
        // })
    })
}



























