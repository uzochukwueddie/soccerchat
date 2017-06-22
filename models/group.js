var mongoose = require('mongoose');

var groupMsgSchema = mongoose.Schema({
    sender: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    body: {type: String},
//    userImage: {type: String, default: 'defaultPic.png'},
    createdAt: {type: Date, required: true, default: Date.now}
});

module.exports = mongoose.model('GroupMessage', groupMsgSchema);