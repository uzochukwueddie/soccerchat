var mongoose = require('mongoose');

var clubNames = mongoose.Schema({
    name: {type: String, default: ''},
    country: {type: String, default: ''},
    image: {type: String, default: 'defaultPic.png'},
    fans: [{
        username: {type: String, default: ''},
        email: {type: String, default: ''}
    }]
});

module.exports = mongoose.model('Club', clubNames);