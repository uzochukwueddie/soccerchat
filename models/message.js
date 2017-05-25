var mongoose = require('mongoose');

var messageSchema = mongoose.Schema({
    body: {type: String, required: [true, 'Message body is required'], default: ''},
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    receiver: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    authorName: {type: String},
    receiverName: {type: String},
    isRead: {type: Boolean, default: false},
    createdAt: {type: Date, required: true, default: Date.now}
});

module.exports = mongoose.model('Message', messageSchema);

//module.exports = mongoose.model('Message', messageSchema);