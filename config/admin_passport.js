var passport = require('passport');
var Admin = require('../models/admin');
var LocalStrategy = require('passport-local').Strategy;
var async = require('async');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    Admin.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use('local.sign_up', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {

    Admin.findOne({'email':email}, (err, user) => {
        if(err){
            return done(err);
        }

        if(user){
            return done(null, false, req.flash('error', 'Email Already Exist.'));
        }
        
        var newAdmin = new Admin();
        newAdmin.fullname = req.body.fullname
        newAdmin.email = req.body.email;
        newAdmin.password = newAdmin.encryptPassword(req.body.password);

        newAdmin.save((err) => {
            return done(null, newAdmin);
        });
    })
}));

passport.use('local.log_in', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {

    Admin.findOne({'email':email}, (err, user) => {
        if(err){
            return done(err);
        }

        var messages = [];
            
        if(!user.validPassword(password)){
            messages.push('Password is Invalid')
            return done(null, false, req.flash('error', messages));
        }
        
        return done(null, user); 
        
        
    });
}));

























