var Club = require('../models/clubs');
var User = require('../models/user');
var passport = require('passport');
var async = require('async');
var formidable = require('formidable');
var path = require('path');
var fs = require('fs');
var Message = require('../models/message');


var aws = require('aws-sdk');
var multerS3 = require('multer-s3');
var multer = require('multer');

aws.config.update({
    accessKeyId: process.env.SECRET_AWS_ACCESSKEYID,
    secretAccessKey: process.env.SECRET_AWS_SECRETACCESSKEY,
    region: process.env.SECRET_AWS_REGION
});

var s0 = new aws.S3({});

var upload = multer({
    storage: multerS3({
        s3: s0,
        bucket: 'soccerchatuser',
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
    
    app.get('/settings/profile', isLoggedIn, (req, res) => {

        async.parallel([
            function(callback){
                Message.aggregate(
                {$match:{$or:[{"authorName":req.user.username}, {"receiverName":req.user.username}]}},
                {$sort:{'createdAt':-1}},
                {
                    $group:{"_id":{
                    "last_message_between":{
                        $cond:[
                            {
                                $lt:[
                                {$substr:["$authorName",0,1]},
                                {$substr:["$receiverName",0,1]}]
                            },
                            {$concat:["$authorName"," and ","$receiverName"]},
                            {$concat:["$receiverName"," and ","$authorName"]}
                        ]
                    }
                    },"body":{$first:"$$ROOT"}
                    }
                },function(err, newResult){
                    var opts = [
                      { path: 'body.author', model: 'User' },
                      { path: 'body.receiver', model: 'User' }
                    ]

                    Message.populate(newResult, opts, function (err, newResult1) {
                        callback(err, newResult1);
                    });
                })
            },

            function(callback){
                User.findOne({'username':req.user.username})
                    .populate('request.userId')
                    .populate('friendsList.friendId')
                    .exec((err, result) => {
                        callback(err, result);
                    })
            }
        ], (err, results) => {
            var result1 = results[0];
            var result2 = results[1];
            
            Message.find({'$or': [{"authorName":req.user.username}, {"receiverName":req.user.username}]})
                .populate('author')
                .populate('receiver')
                .exec((err, result3) => {
                    res.render('user/profile', {title: 'Profile Settings || Soccerkik', user:req.user, message:result1, data:result2, image:result3});
                })
        })
    });
    
    app.post('/settings/profile', (req, res) => {

        async.waterfall([
            function(callback){
                User.findOne({"_id":req.user._id}, (err, result) => {
                    callback(err, result);
                })
            },

            function(result, callback){
                if(req.body.upload === null || req.body.upload === ''){
                    User.update({
                        '_id': req.user._id
                    },
                    {
                        'fullname': req.body.fullname,
                        'city': req.body.city,
                        'description': req.body.description,
                        'gender': req.body.gender,
                        'userImage': result.userImage
                    }, 
                    { 
                        upsert: true 
                        
                    }, (err, result) => {
                        res.redirect('/settings/profile')
                    })
                }else if(req.body.upload !== '' || req.body.upload !== null){
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
                        res.redirect('/settings/profile')
                    })
                }
            }
        ])

        PostRequest(req, res, '/settings/profile');



    });

    app.post('/userupload', upload.any(), (req, res) => {
        var form = new formidable.IncomingForm();
        
        form.on('file', (field, file) => {
            
        });
        
        form.on('error', (err) => {
            //console.log('An error occured', err);
        });
        
        form.on('end', () => {
            //console.log('User file upload was successful');
        });
        
        form.parse(req);
    });


    
    app.get('/settings/interests', isLoggedIn, (req, res) => {
        
        async.parallel([
            function(callback){
                Message.aggregate(
                {$match:{$or:[{"authorName":req.user.username}, {"receiverName":req.user.username}]}},
                {$sort:{'createdAt':-1}},
                {
                    $group:{"_id":{
                    "last_message_between":{
                        $cond:[
                            {
                                $lt:[
                                {$substr:["$authorName",0,1]},
                                {$substr:["$receiverName",0,1]}]
                            },
                            {$concat:["$authorName"," and ","$receiverName"]},
                            {$concat:["$receiverName"," and ","$authorName"]}
                        ]
                    }
                    },"body":{$first:"$$ROOT"}
                    }
                },function(err, newResult){
                    var opts = [
                      { path: 'body.author', model: 'User' },
                      { path: 'body.receiver', model: 'User' }
                    ]

                    Message.populate(newResult, opts, function (err, newResult1) {
                        callback(err, newResult1);
                    });
                })
            },

            function(callback){
                User.findOne({'username':req.user.username})
                    .populate('request.userId')
                    .exec((err, result) => {
                        callback(err, result);
                    })
            }
        ], (err, results) => {
            var result1 = results[0];
            var result2 = results[1];
            
            Message.find({'$or': [{"authorName":req.user.username}, {"receiverName":req.user.username}]})
                .populate('author')
                .populate('receiver')
                .exec((err, result3) => {
                    res.render('user/interests', {title: 'Interests || Soccerkik', user:req.user, message:result1, data:result2, image:result3});
                })
        })        
        
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
        });

        async.parallel([
            function(callback){
                if(req.body.team_id){
                    User.update({
                       '_id': req.user._id
                    },
                    {
                       $pull: {favNationalTeam: {
                            _id: req.body.team_id
                        }}
                    }, (err, count) => {
                        callback(err, count);
                    })
                }
            }
        ], (err, results) => {
            res.redirect('/settings/interests');
        })

        async.parallel([
            function(callback){
                if(req.body.club_id){
                    User.update({
                       '_id': req.user._id
                    },
                    {
                       $pull: {favClub: {
                            '_id': req.body.club_id
                        }}
                    }, (err, count) => {
                        callback(err, count);
                    })
                }
            }
        ], (err, results) => {
            res.redirect('/settings/interests');
        })

        async.parallel([
            function(callback){
                if(req.body.player_id){
                    User.update({
                       '_id': req.user._id
                    },
                    {
                       $pull: {favPlayers: {
                            '_id': req.body.player_id
                        }}
                    }, (err, count) => {
                        callback(err, count);
                    })
                }
            }
        ], (err, results) => {
            res.redirect('/settings/interests');
        })

        PostRequest(req, res, '/settings/interests');

        
    });
    
    app.get('/profile/:name', isLoggedIn, (req, res) => {
        var name = req.params.name

        async.parallel([
            function(callback){
                Message.aggregate(
                {$match:{$or:[{"authorName":req.user.username}, {"receiverName":req.user.username}]}},
                {$sort:{'createdAt':-1}},
                {
                    $group:{"_id":{
                    "last_message_between":{
                        $cond:[
                            {
                                $lt:[
                                {$substr:["$authorName",0,1]},
                                {$substr:["$receiverName",0,1]}]
                            },
                            {$concat:["$authorName"," and ","$receiverName"]},
                            {$concat:["$receiverName"," and ","$authorName"]}
                        ]
                    }
                    },"body":{$first:"$$ROOT"}
                    }
                },function(err, newResult){
                    var opts = [
                      { path: 'body.author', model: 'User' },
                      { path: 'body.receiver', model: 'User' }
                    ]

                    Message.populate(newResult, opts, function (err, newResult1) {
                        callback(err, newResult1);
                    });
                })
            },

            function(callback){
                User.findOne({'username':req.params.name})
                    .populate('request.userId')
                    .exec((err, result) => {
                        callback(err, result);
                    })
            }
        ], (err, results) => {
            var result1 = results[0];
            var result2 = results[1];
            
            Message.find({'$or': [{"authorName":req.user.username}, {"receiverName":req.user.username}]})
                .populate('author')
                .populate('receiver')
                .exec((err, result3) => {
                    res.render('user/userprofile', {title: '@'+name+' || Soccerkik', user:req.user, message:result1, data:result2, image:result3});
                })
        })
    });

    app.post('/profile/:name', (req, res) => {

        PostRequest(req, res, '/profile/'+req.params.name);
    })
    
    
    
    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });
}

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        next();
    }else{
		res.redirect('/');
	}
}

function PostRequest(req, res, link){
    async.parallel([
        function(callback){
            if(req.body.senderId){
                //This function is used to update the document of the receiver of the friend request
                User.update({
                   '_id': req.user._id,
                   'friendsList.friendId': {$ne: req.body.senderId}
                },
                {
                   $push: {friendsList: {
                       friendId: req.body.senderId,
                       friendName: req.body.senderName
                   }},
                   $pull: {request: {
                        userId: req.body.senderId,
                        username: req.body.senderName
                    }},
                    $inc: {totalRequest: -1},
                }, (err, count) => {
                   callback(err, count);
                })
            }
        },
        
        //This function is used to update the document of the sender of the 
        //friend request
        function(callback){
            if(req.body.senderId){
                User.update({
                   '_id': req.body.senderId,
                   'friendsList.friendId': {$ne: req.user._id}
                },
                {
                   $push: {friendsList: {
                       friendId: req.user._id,
                       friendName: req.user.username
                   }},
                   $pull: {sentRequest: {
                        username: req.user.username
                    }}
                }, (err, count) => {
                   callback(err, count);
                })
            }
        },
        
        function(callback){
            if(req.body.user_Id){
                User.update({
                   '_id': req.user._id,
                   'request.userId': {$eq: req.body.user_Id}
                },
                {
                   $pull: {request: {
                        userId: req.body.user_Id,
                    }},
                    $inc: {totalRequest: -1}
                }, (err, count) => {
                    callback(err, count);
                })
            }
        },

        //This is used to update the sentRequest array for the sender of the friend request
        function(callback){
            if(req.body.user_Id){
                User.update({
                   '_id': req.body.user_Id,
                   'sentRequest.username': {$eq: req.user.username}
                },
                {
                   $pull: {sentRequest: {
                        username: req.user.username
                    }}
                }, (err, count) => {
                    callback(err, count);
                })
            }
        },

        function(callback){
            if(req.body.chatId){
                Message.update({
                    '_id': req.body.chatId
                },
                {
                    "isRead": true
                }, (err, done) => {
                    callback(err, done)
                })
            }
        }
    ], (err, results) => {
        res.redirect(link)
    });
}


