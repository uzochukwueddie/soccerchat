var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    username: {type: String, default: ''},
    fullname: {type: String, default: ''},
    email: {type: String, default: ''},
    gender: {type: String},
    password: {type: String},
    club: {type: String, default: ''},
    userImage: {type: String, default: 'defaultPic.png'},
    sentRequest: [{
        username: {type: String, default: ''}
    }],
    request: [{
        userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        username: {type: String, default: ''},
    }],
    friendsList: [{
        friendId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        friendName: {type: String, default: ''}
    }], 
    totalRequest: {type: Number, default: 0},
    favClub: [{
        favClubName: {type: String, default: ''}
    }],
    city: {type: String, default: ''},
    description: {type: String, default: ''},
    favNationalTeam: [{
        teamName: {type: String, default: '', required: true},
    }],
    favPlayers: [{
        favPlayersName: {type: String, default: '', required: true},
    }],
    passwordResetToken: {type: String, default: ''},
    passwordResetExpires: {type: Date, default: ''}
});

userSchema.methods.encryptPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};



module.exports = mongoose.model('User', userSchema);







































