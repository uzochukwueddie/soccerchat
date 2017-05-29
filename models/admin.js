var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var adminSchema = mongoose.Schema({
    fullname: {type: String, unique: true},
    email: {type: String, unique: true},
    password: {type: String}
    
});

adminSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

adminSchema.methods.encryptPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

module.exports = mongoose.model('Admin', adminSchema);







































