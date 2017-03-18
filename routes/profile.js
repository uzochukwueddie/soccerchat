var Club = require('../models/clubs');
var User = require('../models/user');
var passport = require('passport');
var async = require('async');
var formidable = require('formidable');
var path = require('path');
var fs = require('fs');



module.exports = (app) => {
    
    app.get('/settings/profile', (req, res) => {
        User.findOne({"fullname":req.user.fullname}, (err, result) => {
            res.render('user/profile', {title: 'Profile Settings || Soccer Chat', user:req.user, data:result});
        })
    });
    
    app.post('/settings/profile', (req, res) => {
        User.update({
            '_id': req.user._id
        },
        {
            'fullname': req.body.fullname,
            'city': req.body.city,
            'description': req.body.description,
            'gender': req.body.gender,
            'userImage': req.body.upload
        }, 
        { 
            upsert: true 
            
        }, (err, result) => {
            console.log(req.body.upload)
            res.redirect('/settings/profile')
        })
    });

    app.post('/userupload', (req, res) => {
        var form = new formidable.IncomingForm();
        
        form.uploadDir = path.join(__dirname, '../public/profileImages');
        
        form.on('file', (field, file) => {
           fs.rename(file.path, path.join(form.uploadDir, file.name), (err) => {
               if(err){
                   throw err
               }
               
               console.log('User file has been renamed');
           }); 
        });
        
        form.on('error', (err) => {
            console.log('An error occured', err);
        });
        
        form.on('end', () => {
            console.log('User file upload was successful');
        });
        
        form.parse(req);
    });
    
    app.get('/settings/interests', (req, res) => {
        res.render('user/interests', {title: 'Interests || Soccer Chat', user:req.user});
        
        
    });
    
    app.post('/settings/interests', (req, res) => {
        
        async.parallel([
            function(callback){
                User.update({
                   '_id': req.user._id
                },
                {
                   $pull: {favNationalTeam: {
                        teamName: req.body.name
                    }}
                }, (err, count) => {
                    callback(err, count);
                })
            },
            
            function(callback){
                User.update({
                   '_id': req.user._id
                },
                {
                   $pull: {favClub: {
                        favClubName: req.body.name
                    }}
                }, (err, count) => {
                    callback(err, count);
                })

            },
            
            function(callback){
                User.update({
                   '_id': req.user._id
                },
                {
                   $pull: {favPlayers: {
                        favPlayersName: req.body.name
                    }}
                }, (err, count) => {
                    callback(err, count);
                })

            }
        ])
        
        async.parallel([
            function(callback){
                if(req.body.national){
                    User.update({
                        '_id': req.user._id
                    },
                    {
                        $push: {favNationalTeam: {
                           teamName: req.body.national
                       }}
                    }, (err, result) => {
                        callback(err, result)

                    })
                }
                
            }
        ], (err, results) => {
            res.redirect('/settings/interests');
        })
        
        async.parallel([
            function(callback){
                if(req.body.favClub){
                    User.update({
                       '_id': req.user._id,
                       'favClub.favClubName': {$ne: req.body.favClub}
                    },
                    {
                       $push: {favClub: {
                           favClubName: req.body.favClub
                       }}
                    }, (err, result1) => {
                        callback(err, result1)
                    })
                }
            }
        ], (err, results) => {
            res.redirect('/settings/interests');
        });
        
        async.parallel([
            function(callback){
                if(req.body.favPlayers){
                    User.update({
                       '_id': req.user._id,
                       'favPlayers.favPlayersName': {$ne: req.body.favPlayers}
                    },
                    {
                       $push: {favPlayers: {
                           favPlayersName: req.body.favPlayers
                       }}
                    }, (err, result3) => {
                        callback(err, result3)
                    })
                }
            }
        ], (err, results) => {
            res.redirect('/settings/interests');
        })
    });
    
    app.get('/profile/:name', (req, res) => {
        var name = req.params.name
        
        User.findOne({"username":req.params.name}, (err, result) => {
            res.render('user/userprofile', {title: '@'+name+' || Soccer Chat', user:req.user, data:result});
        })
    });
    
    
    
    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });
}


