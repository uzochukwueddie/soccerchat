var Club = require('../models/clubs');
var User = require('../models/user');


var generateMessage = (from, text, room) => {
  return {
    from,
    text,
    room,
    createdAt: new Date().getTime()
  }
};

//var getUserRoom = (callback) => {
//    User.findOne({}, (err, data) => {
//        return callback(err, data)
//    })
//}



module.exports = {generateMessage};
