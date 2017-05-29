var Club = require('../models/clubs');
var User = require('../models/user');
var Message = require('../models/message');
var async = require('async');
var ObjectId = require('mongodb').ObjectID;
var mongoose = require('mongoose')

module.exports = (app) => {
    
    app.get('/chat/:name', (req, res, next) => {
        var name_Params = req.params.name
        
        var paramsName = req.params.name.split('@')
        var nameParams = paramsName[1];
        
        async.parallel([
            
            function(callback){
                User.findOne({'username':req.user.username}, (err, result1) => {
                    callback(err, result1);
                });
            },
            
            function(callback){
                User.findOne({'username':nameParams}, (err, result2) => {
                    callback(err, result2);
                });
            }, 

            function(callback){
                Message.aggregate(
                {$match:{$or:[{"authorName":req.user.username}, {"receiverName":req.user.username}]}},
                {$sort:{'createdAt':-1}},
                {
                    $group:{"_id":{
                    "last_message_between":{
                        $cond:[
                            {
                                $gt:[
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
                });
            },
            
        ], (err, results) => {
            var result = results[0];
            var resultdata = results[1];
            var data = results[2];

            var val = ''
            var id = new ObjectId(resultdata._id)

            for(var i = 0; i < data.length; i++){
                val = data[i].body.authorName;
            }
            
            Message.find({'$or': [{'author':req.user._id, 'receiver':resultdata._id}, 
              {'author': resultdata._id, 'receiver':req.user._id}]}, (err, result3) => {
                res.render('chat', {title: '@'+nameParams+' | Soccer Chat', user:req.user, data:result, 
                  data1: resultdata, name: '@'+nameParams, chatNames:name_Params, chats:result3, 
                  chat:data, username:resultdata.username, val:val, id: id });
            });
        });
    });
    
    app.post('/chat/:name', (req, res, next) => {
        // var nameParams = req.params.name
        
        var paramsName = req.params.name.split('@');
        var nameParams = paramsName[1];
        
        async.parallel([
            function(callback){
                User.findOne({'username':nameParams}, (err, data) => {
                   if(err){
                      console.log('Error:',err)
                    }else{
                        var newMessage = new Message();
                        newMessage.author = req.user._id;
                        newMessage.receiver = data._id;
                        newMessage.authorName = req.user.username;
                        newMessage.receiverName = nameParams;
                        newMessage.body = req.body.message;
                        newMessage.createdAt = new Date();

                        newMessage.save((err, newMessage) => {
                          if (err) {
                            console.log('Save error:',err);
                          }
                          callback(err, newMessage)
//                           res.redirect('/chat/'+req.params.name);
                        });
                    }
                })
            },
        ], (err, result) => {
            res.redirect('/chat/'+req.params.name);
        });
        
        // async.parallel([
        //     function(callback){
        //         Message.update({
        //             '':req.body.chat_id
        //         },
        //         {
        //             "isRead": true
        //         }, (err, done) => {
        //           console.log('Doneeeeeeeeeeeeeeeeeeeee')
        //             callback(err, done);
        //         })
        //     }
        // ])
        
        
        async.parallel([
            function(callback){
                if(req.body.senderId){
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
                if(req.body.senderId){
                    User.update({
                       '_id': req.body.user_Id,
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
            },

            function(callback){
                if(req.body.chat_id){
                    Message.update({
                        'author': req.body.chat_id
                    },
                    {
                        "isRead": true
                    }, 
                    {
                        // multi: true
                    },(err, done) => {
                      console.log('Done', req.body.chat_id)
                       callback(err, done);
                    })
                }
            }

        ], (err, results) => {
            res.redirect('/chat/'+req.params.name);
        })
    });
    
    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });
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
       res.redirect('/');
   }else{
       return next();
   }
}

//Fussy search mongodb
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};