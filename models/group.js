var mongoose = require('mongoose');

var groupMsgSchema = mongoose.Schema({
    sender: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    body: {type: String},
//    groupId: {type: mongoose.Schema.Types.ObjectId, ref: 'Club'},
    groupId: {type: String},
    createdAt: {type: Date, required: true, default: Date.now}
});

module.exports = mongoose.model('GroupMessage', groupMsgSchema);