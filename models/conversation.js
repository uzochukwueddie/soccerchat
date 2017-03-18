var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

// Schema defines how chat messages will be stored in MongoDB
var ConversationSchema = new Schema({
  participants: { 
      sender: {type: Schema.Types.ObjectId, ref: 'User'},
      receiver: {type: Schema.Types.ObjectId, ref: 'User' }
  }
});

module.exports = mongoose.model('Conversation', ConversationSchema);