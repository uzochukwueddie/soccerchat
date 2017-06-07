var Club = require('../models/clubs');
var formidable = require('formidable');
var path = require('path');
var fs = require('fs');
var passport = require('passport');

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
        })
    });
    
    app.post('/upload', (req, res) => {
        var form = new formidable.IncomingForm();
        
        form.uploadDir = path.join(__dirname, '../public/uploads');
        
        form.on('file', (field, file) => {
           fs.rename(file.path, path.join(form.uploadDir, file.name), (err) => {
               if(err){
                   throw err
               }
               
               console.log('File has been renamed');
           }); 
        });
        
        form.on('error', (err) => {
            console.log('An error occured', err);
        });
        
        form.on('end', () => {
            console.log('File upload was successful');
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
//   req.check("password", "Password Must Contain at least 1 Number.").matches(/^(?=.*\d)(?=.*[a-z])[0-9a-z]{5,}$/, "i");

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