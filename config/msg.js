module.exports = (io) => {
    //io.on lets you registeran event listener
    //Connection lets you listen for a new connection
    io.on('connection', (socket) => {
        
        socket.on('joinMessage', (newParams, callback) => {
            socket.join(newParams.room);
            socket.join(newParams.room1);
        });
        
        
        socket.on('message', function(message, callback) {
            io.to(message.room).emit('newMessage', { 
                text : message.text, 
                from : message.from,
                receiver: message.receiver,
                room: message.room,
                room1: message.room1
            });
            
            callback();
        });
        
        
        socket.on('disconnect', () => {
            
        })
    })
}



























