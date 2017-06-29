var Club = require('../models/clubs');
var formidable = require('formidable');
var path = require('path');
var fs = require('fs');
var passport = require('passport');
//var secret = require('../secret/secret');

var aws = require('aws-sdk');
var multerS3 = require('multer-s3');
var multer = require('multer');

AWS::S3::Base.establish_connection!(
    :access_key_id   => ENV['SECRET_AWS_ACCESSKEYID'],
    :secret_access_key => ENV['SECRET_AWS_SECRETACCESSKEY'],
    :region => ENV['SECRET_AWS_REGION']
)

aws.config.update({
    accessKeyId: process.env.SECRET_AWS_ACCESSKEYID,
    secretAccessKey: process.env.SECRET_AWS_SECRETACCESSKEY,
    region: process.env.SECRET_AWS_REGION
});

var s0 = new aws.S3({});

var upload = multer({
    storage: multerS3({
        s3: s0,
        bucket: 'clubpictures',
        acl: 'public-read',
        metadata: function(req, file, cb){
            cb(null, {fieldName: file.fieldname});
        },
        key: function(req, file, cb){
            cb(null, file.originalname);
        }
    }),
    
    rename: function (fieldname, filename) {
        return filename.replace(/\W+/g, '-').toLowerCase();
    }
});

module.exports = (app) => {

    app.get('/bo_admin_dev_signup', (req, res) => {
        var errors = req.flash('error');
        res.render('admin/signup', {title: 'Admin Signup | Soccerchat', messages: errors, hasErrors: errors.length > 0});
    });

    app.post('/bo_admin_dev_signup', signupValidation, passport.authenticate('local.sign_up', {
        successRedirect: '/admin/dashboard',
        failureRedirect: '/bo_admin_dev_signup',
        failureFlash : true
    }));

    app.get('/bo_admin_dev_login', (req, res) => {
        var errors = req.flash('error');
        res.render('admin/login', {title: 'Admin Login | Soccerchat', messages: errors, hasErrors: errors.length > 0});
    });

    app.post('/bo_admin_dev_login', loginValidation, passport.authenticate('local.log_in', {
        successRedirect: '/admin/dashboard',
        failureRedirect: 'bo_admin_dev_login',
        failureFlash : true
    }));
    
    app.get('/admin/dashboard', (req, res) => {
        res.render('admin/dashboard');
    });
    
    app.post('/admin/dashboard', (req, res, next) => {
        var newClub = new Club();
        newClub.name = req.body.club;
        newClub.country = req.body.country;
        newClub.image = req.body.upload;
        
        newClub.save((err) => {
            if(err){
                return next(err);
            }
            
            res.render('admin/dashboard');
        });
        
    });
    
    app.post('/upload', upload.any(), (req, res) => {
        var form = new formidable.IncomingForm();  
        
        form.on('file', (field, file) => {

        });
               
        form.on('error', (err) => {
//            console.log('An error occured', err);
        });
        
        form.on('end', () => {
//            console.log('File upload was successful');
        });
        
        form.parse(req);
        
    });

    app.get('/admin/logout', (req, res) => {
        req.logout();
        res.redirect('/admin/login');
    });
}

function signupValidation(req, res, next){
   req.checkBody('fullname', 'Fullname Must Not Be Empty').notEmpty();
   req.checkBody('email', 'Email is Required').notEmpty();
   req.checkBody('email', 'Email is Invalid').isEmail();
   req.checkBody('password', 'Password is Required').notEmpty();
   req.checkBody('password', 'Password Must Not Be Less Than 5 Characters').isLength({min:5});

   var regErrors = req.validationErrors();

   if(regErrors){
       var messages = [];
       regErrors.forEach((error) => {
           messages.push(error.msg);
       });

       req.flash('error', messages);
       res.redirect('/admin/signup');
   }else{
       return next();
   }
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
       res.redirect('/admin/login');
   }else{
       return next();
   }
}

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/admin/login');
}