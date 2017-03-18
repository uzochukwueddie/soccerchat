var mongoose = require('mongoose'),
      Schema = mongoose.Schema;

//var messageSchema = mongoose.Schema({
//    body: {type: String, required: true},
//    userFrom: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
//    userTo: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
//    userFromName: {type: String, required: true},
//    userToName: {type: String, required: true},
//    createdAt: {type: Date, required: true, default: Date.now}
//});

var MessageSchema = new Schema({
    body: {type: String, required: true},
    author: {type: Schema.Types.ObjectId, ref: 'User'},
    receiver: {type: Schema.Types.ObjectId, ref: 'User'},
    authorName: {type: String, required: true},
    receiverName: {type: String, required: true},
    isRead: {type: Boolean, default: false}
},
  {
    timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
  });

module.exports = mongoose.model('Message', MessageSchema)

//module.exports = mongoose.model('Message', messageSchema);