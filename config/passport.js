var passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;
var async = require('async');
var Club = require('../models/clubs');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {

    User.findOne({"$or":[{'email':email},{'username':req.body.username}]}, (err, user) => {
        if(err){
            return done(err);
        }

        if(user){
            return done(null, false, req.flash('error', 'Username Or Email Already Exist.'));
        }
        
        async.parallel([
            function(callback){
               Club.update({
                   'name':req.body.club,
                   'fans.email': {$ne:req.body.email}
               },
               {
                    $push: {fans: {
                        username:req.body.username,
                        email:req.body.email
                    }}
               }, (err, count) => {
                   callback(err, count)
               })
            },
            
            function(callback){
                var newUser = new User();
                newUser.username = req.body.username;
                newUser.email = req.body.email;
                newUser.password = newUser.encryptPassword(req.body.password);
                newUser.club = req.body.club;

                newUser.save((err) => {
                    callback(err, newUser)
//                    return done(null, newUser);
                });
            }
        ], (err, result) => {
            var newUser = result[1];
            return done(null, newUser);
        });
    })
}));

passport.use('local.login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {

    User.findOne({'email':email}, (err, user) => {
        if(err){
            return done(err);
        }
        
        var messages = [];
        
        if(!user || !user.validPassword(password)){
            messages.push('Email Does Not Exist Or Password is Invalid')
            return done(null, false, req.flash('error', messages));
        }
        
        return done(null, user); 
    });
}));

























