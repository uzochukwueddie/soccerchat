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
    
    app.get('/send_message', isLoggedIn, (req, res) => {
        var info = req.flash('info');
        var errors = req.flash('error');

        res.render('contact', {title: 'Soccerkik | Send Message', messages: errors, hasErrors: errors.length > 0, info: info, noErrors: info.length > 0})        
    });

    app.post('/send_message', contactValidation, (req, res) => {
        User.findOne({'email': req.user.email}, (err, user) => {
            var smtpTransport = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: process.env.SECRET_AUTH_USER,
                    pass: process.env.SECRET_AUTH_PASS
                }
            });

            var mailOptions = {
                to: process.env.SECRET_AUTH_USER,
                from: 'Soccerkik '+'<'+process.env.SECRET_AUTH_USER+'>',
                from: req.body.email,
                subject: req.body.subject,
                html: '<h3>Message from:</h3> '+'<h4>'+ req.body.email +'</h4>'+'  \n\n'+
                        '<h3>Message content:</h3> '+'<p>'+req.body.message+'</p>'+'\n\n'
            };

            smtpTransport.sendMail(mailOptions, (err, response) => {
               req.flash('info', 'Your message has been sent successfully');
                res.redirect('/send_message');
            });
        })
    });
    
    
}


var contactValidation = (req, res, next) => {
   req.checkBody('subject', 'Subject Must Not Be Empty').notEmpty();
   req.checkBody('email', 'Email is Required').notEmpty();
   req.checkBody('email', 'Email is Invalid').isEmail();
   req.checkBody('message', 'Message Field Must Not Be Empty').notEmpty();

    
    req.getValidationResult()
        .then((result) => {
            const errors = result.array();
            const messages = [];
            errors.forEach((error) => {
                messages.push(error.msg);
            });

            req.flash('error', messages);
            res.redirect('/send_message');
        })
        .catch((err) => {
            return next();
        })
}

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        next();
    }else{
		res.redirect('/');
	}
    
}
