var {generateMessage} = require('./message');
var {isRealString} = require('./validation');
var {Users} = require('./users');

var users = new Users();


module.exports = (io) => {
    //io.on lets you registeran event listener
    //Connection lets you listen for a new connection
    io.on('connection', (socket) => {
        
        socket.on('joinPM', (newParams, callback) => {
            socket.join(newParams.room);
            socket.join(newParams.room1);
        });
        
        
        socket.on('private message', function(message, callback) {
            
            io.to(message.room).emit('new PM message', { 
                text : message.text, 
                from : message.from,
                receiver: message.receiver,
                room: message.room,
                room1: message.room1,
                userImage: message.userImg,
                createdAt: new Date()
            });

            io.emit('my message', {})
            
            callback();
        });

        socket.on('refresh div', function(refresh, callback){
            io.to(refresh.room).emit('new refresh', {})
            io.to(refresh.room1).emit('new refresh', {})

            callback()
        })
        
        
        socket.on('disconnect', () => {
            
        })
    })
}



























