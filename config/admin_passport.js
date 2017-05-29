var passport = require('passport');
var Admin = require('../models/admin');
var LocalStrategy = require('passport-local').Strategy;
var async = require('async');

passport.serializeUser((admin, done) => {
    done(null, admin.id);
});

passport.deserializeUser((id, done) => {
    Admin.findById(id, (err, admin) => {
        done(err, admin);
    });
});

passport.use('local.sign_up', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {

    Admin.findOne({'email':email}, (err, admin) => {
        if(err){
            return done(err);
        }

        if(admin){
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

    Admin.findOne({'email':email}, (err, admin) => {
        if(err){
            return done(err);
        }

        var messages = [];
            
        if(!admin.validPassword(password)){
            messages.push('Password is Invalid')
            return done(null, false, req.flash('error', messages));
        }
        
        return done(null, admin); 
        
        
    });
}));

























