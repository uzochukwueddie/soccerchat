var Club = require('../models/clubs');
var User = require('../models/user');
var passport = require('passport');
var async = require('async');
var formidable = require('formidable');
var path = require('path');
var fs = require('fs');
var Message = require('../models/message');



module.exports = (app) => {
    
    app.get('/settings/profile', (req, res) => {

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
                    callback(err, newResult);
                })
            },

            function(callback){
                User.findOne({"fullname":req.user.fullname}, (err, result) => {
                    callback(err, result);
                })
            }
        ], (err, results) => {
            var result1 = results[0];
            var result2 = results[1];

            res.render('user/profile', {title: 'Profile Settings || Soccer Chat', user:req.user, message:result1, data:result2});
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

    app.post('/userupload', (req, res) => {
        var form = new formidable.IncomingForm();
        
        form.uploadDir = path.join(__dirname, '../public/profileImages');
        
        form.on('file', (field, file) => {
           fs.rename(file.path, path.join(form.uploadDir, file.name), (err) => {
               if(err){
                   throw err;
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
        // res.render('user/interests', {title: 'Interests || Soccer Chat', user:req.user});
        
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
                    callback(err, newResult);
                })
            },

            function(callback){
                User.findOne({"fullname":req.user.fullname}, (err, result) => {
                    //console.log(result)
                    callback(err, result);
                })
            }
        ], (err, results) => {
            var result1 = results[0];
            var result2 = results[1];

            res.render('user/interests', {title: 'Interests || Soccer Chat', user:req.user, message:result1, data:result2});
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

        PostRequest(req, res, '/settings/interests');

        // async.parallel([
        //     function(callback){
        //         if(req.body.senderId){
        //             //This function is used to update the document of the receiver of the friend request
        //             User.update({
        //                '_id': req.user._id,
        //                'friendsList.friendId': {$ne: req.body.senderId}
        //             },
        //             {
        //                $push: {friendsList: {
        //                    friendId: req.body.senderId,
        //                    friendName: req.body.senderName
        //                }},
        //                $pull: {request: {
        //                     userId: req.body.senderId,
        //                     username: req.body.senderName
        //                 }},
        //                 $inc: {totalRequest: -1},
        //             }, (err, count) => {
        //                callback(err, count);
        //             })
        //         }
        //     },
            
        //     //This function is used to update the document of the sender of the 
        //     //friend request
        //     function(callback){
        //         if(req.body.senderId){
        //             User.update({
        //                '_id': req.body.senderId,
        //                'friendsList.friendId': {$ne: req.user._id}
        //             },
        //             {
        //                $push: {friendsList: {
        //                    friendId: req.user._id,
        //                    friendName: req.user.username
        //                }},
        //                $pull: {sentRequest: {
        //                     username: req.user.username
        //                 }}
        //             }, (err, count) => {
        //                callback(err, count);
        //             })
        //         }
        //     },
            
        //     function(callback){
        //         if(req.body.user_Id){
        //             User.update({
        //                '_id': req.user._id,
        //                'request.userId': {$eq: req.body.user_Id}
        //             },
        //             {
        //                $pull: {request: {
        //                     userId: req.body.user_Id,
        //                 }},
        //                 $inc: {totalRequest: -1}
        //             }, (err, count) => {
        //                 callback(err, count);
        //             })
        //         }
        //     },

        //     //This is used to update the sentRequest array for the sender of the friend request
        //     function(callback){
        //         if(req.body.user_Id){
        //             User.update({
        //                '_id': req.body.user_Id,
        //                'sentRequest.username': {$eq: req.user.username}
        //             },
        //             {
        //                $pull: {sentRequest: {
        //                     username: req.user.username
        //                 }}
        //             }, (err, count) => {
        //                 callback(err, count);
        //             })
        //         }
        //     },

        //     function(callback){
        //         if(req.body.chatId){
        //             Message.update({
        //                 '_id': req.body.chatId
        //             },
        //             {
        //                 "isRead": true
        //             }, (err, done) => {
        //                 callback(err, done)
        //             })
        //         }
        //     }
        // ], (err, results) => {
        //     res.redirect('/settings/interests')
        // });
    });
    
    app.get('/profile/:name', (req, res) => {
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
                    callback(err, newResult);
                })
            },

            function(callback){
                User.findOne({"username":req.params.name}, (err, result) => {
                    callback(err, result);
                })
            }
        ], (err, results) => {
            var result1 = results[0];
            var result2 = results[1];

            res.render('user/userprofile', {title: '@'+name+' || Soccer Chat', user:req.user, message:result1, data:result2});
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


