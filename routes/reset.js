var Club = require('../models/clubs');
var User = require('../models/user');
var Message = require('../models/message');
var passport = require('passport');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var async = require('async');
var {validate} = require('../config/validation');
var random = require('random-string-module');



module.exports = (app, io) => {
    
    app.get('/forgot_password', (req, res) => {
        var errors = req.flash('error');
        
        var info = req.flash('info');

        res.render('forgot', {title: 'Soccerkik | Forgot Password', messages: errors, hasErrors: errors.length > 0, 
          info: info, noErrors: info.length > 0})        
    });

    app.post('/forgot_password', (req, res) => {
        async.waterfall([
            
            function(callback){
                User.findOne({'email':req.body.email}, (err, user) => {
                    if(!user){
                        req.flash('error', 'No Account With That Email Exist Or Email is Invalid');
                        return res.redirect('/forgot_password');
                    }

                    var token = random.RandomChar(40);
                    
                    user.passwordResetToken = token;
                    user.passwordResetExpires = Date.now() + 60*60*1000;
                    
                    user.save((err) => {
                        callback(err, token, user);
                    });
                })
            },
            
            function(token, user, callback){
                var smtpTransport = nodemailer.createTransport({
//                    service: 'Gmail',
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true,
                    auth: {
                        user: process.env.SECRET_AUTH_USER,
                        pass: process.env.SECRET_AUTH_PASS
                    }
                });
                
                var mailOptions = {
                    to: user.email,
                    from: 'Soccerkik '+'<'+process.env.SECRET_AUTH_USER+'>',
                    subject: 'Soccerkik Password Reset Token',
                    text: 'You have requested for password reset token. \n\n'+
                        'Please click on the link to complete the process: \n\n'+
                        'http://soccerkik.com/reset/'+token+'\n\n'
                };
                
                smtpTransport.sendMail(mailOptions, (err, response) => {
                   req.flash('info', 'A password reset token has been sent to '+user.email);
                    return callback(err, user);
                });
            }
        ], (err) => {
            if(err){
                return next(err);
            }
            
            res.redirect('/forgot_password');
        })
    });

    app.get('/reset/:token', (req, res) => {
        User.findOne({passwordResetToken:req.params.token, passwordResetExpires: {$gt: Date.now()}}, (err, user) => {
            if(!user){
                req.flash('error', 'Password reset token has expired or is invalid. Enter your email to get a new token.');
                return res.redirect('/forgot_password');
            }
            var errors = req.flash('error');
            var success = req.flash('success');
            
            res.render('reset', {title: 'Reset Your Password', messages: errors, hasErrors: errors.length > 0, success:success, noErrors:success.length > 0});
        });
    });

    app.post('/reset/:token', resetPassword, (req, res) => {
        async.waterfall([
            function(callback){
                User.findOne({passwordResetToken:req.params.token, passwordResetExpires: {$gt: Date.now()}}, (err, user) => {
                    if(!user){
                        req.flash('error', 'Password reset token has expired or is invalid. Enter your email to get a new token.');
                        return res.redirect('/forgot_password');
                    }

                      req.checkBody('password', 'Password is Required').notEmpty();
                      req.checkBody('password', 'Password Must Not Be Less Than 5').isLength({min:5});
                      
                      var errors = req.validationErrors();
                      
                      if(req.body.password == req.body.cpassword){
                          if(errors){
                              var messages = [];
                              errors.forEach((error) => {
                                  messages.push(error.msg)
                              })
                              
                              var errors = req.flash('error');
                              return res.redirect('/reset/'+req.params.token);
                          }else{
                              user.password = user.encryptPassword(req.body.password);
                              user.passwordResetToken = undefined;
                              user.passwordResetExpires = undefined;
                              
                              user.save((err) => {
                                  req.flash('success', 'Your password has been successfully updated.');
                                  callback(err, user);
                                  res.redirect('/');
                              })
                          }
                      }else{
                          req.flash('error', 'Password and confirm password are not equal.');
                          return res.redirect('/reset/'+req.params.token);
                      }
                    
                    
                });
            },
            
            function(user, callback){
                var smtpTransport = nodemailer.createTransport({
//                    service: 'Gmail',
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true,
                    auth: {
                        user: process.env.SECRET_AUTH_USER,
                        pass: process.env.SECRET_AUTH_PASS
                    }
                });
                
                var mailOptions = {
                    to: user.email,
                    from: 'Soccerkik '+'<'+process.env.SECRET_AUTH_USER+'>',
                    subject: 'Your password Has Been Updated.',
                    text: 'This is a confirmation that you updated the password for '+user.email
                };
                
                smtpTransport.sendMail(mailOptions, (err, response) => {
                    callback(err, user);

                    req.flash('success', 'Your password has been successfully updated.');
                    
                    //var errors = req.flash('error');
                    var success = req.flash('success');
                    res.redirect('/');
                });
            }
        ]);
    });
    
    
}


function loginValidation(req, res, next){
   req.checkBody('email', 'Email is Required').notEmpty();
   req.checkBody('email', 'Email is Invalid').isEmail();
   req.checkBody('password', 'Password is Required').notEmpty();
   req.checkBody('password', 'Password Must Not Be Less Than 5 Characters').isLength({min:5});

   var loginErrors = req.validationErrors();

   if(loginErrors){
       var messages = [];
       loginErrors.forEach((error) => {
           messages.push(error.msg);
       });

       req.flash('error', messages);
       res.redirect('/');
   }else{
       return next();
   }
}

function resetPassword(req, res, next){
   req.checkBody('password', 'Password is Required').notEmpty();
   req.checkBody('password', 'Password Must Not Be Less Than 5 Characters').isLength({min:5});
   //req.check("password", "Password Must Contain at least 1 Number.").matches(/^(?=.*\d)(?=.*[a-z])[0-9a-z]{5,}$/, "i");

   var resetErrors = req.validationErrors();

   if(resetErrors){
       var messages = [];
       resetErrors.forEach((error) => {
           messages.push(error.msg);
       });

       req.flash('error', messages);
       res.redirect('/reset/'+req.params.token);
   }else{
       return next();
   }
}

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}
