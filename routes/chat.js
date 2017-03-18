var Club = require('../models/clubs');
var User = require('../models/user');
var Message = require('../models/message');
var Conversation = require('../models/conversation');
var async = require('async');

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
                {$match:{$or:[{"authorName":req.user.username},                         {"receiverName":req.user.username}]}},
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
            
        ], (err, results) => {
            var result = results[0];
            var resultdata = results[1];
            var data = results[2];
            
            Message.find({'$or': [{'author':req.user._id, 'receiver':resultdata._id}, {'author': resultdata._id, 'receiver':req.user._id}]}, (err, result3) => {
                
                res.render('chat', {title: '@'+nameParams+' | Soccer Chat', user:req.user, data:result, data1: resultdata, name: '@'+nameParams, chatNames:name_Params, chats:result3, chat:data, username:resultdata.username });
            });
        })
    });
    
    app.post('/chat/:name', (req, res, next) => {
        var nameParams = req.params.name
        
        var paramsName = req.params.name.split('@')
        var nameParams = paramsName[1];
        
        async.parallel([
            function(callback){
                User.findOne({'username':nameParams}, (err, data) => {
                    var newMessage = new Message();
                    newMessage.author = req.user._id;
                    newMessage.receiver = data._id;
                    newMessage.authorName = req.user.username;
                    newMessage.receiverName = data.username;
                    newMessage.body = req.body.message;
                    newMessage.createdAt = new Date();

                    newMessage.save((err, newMessage) => {
                      if (err) {
                        res.send({ error: err });
                        return next(err);
                      }
                       res.redirect('/chat/'+req.params.name);
                    });
                })
            },
        ]);
        
        async.parallel([
            function(callback){
                Message.update({
                    '_id':req.body.chatId
                },
                {
                    "isRead": true
                }, (err, done) => {
                    callback(err, done);

//                    res.redirect('/chat/'+req.params.name);
                })
            }
        ])
        
        
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
                        }}
                    }, (err, count) => {
                       callback(err, count);
                    })
                }
            },
            
            //This function is used to update the document of the receiver of the 
            //friend request
            function(callback){
                if(req.body.senderId){
                    User.update({
                       '_id': req.body.userId,
                       'friendsList.friendId': {$ne: req.user._id}
                    },
                    {
                       $push: {friendsList: {
                           friendId: req.user._id,
                           friendName: req.user.username
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
                        }}
                    }, (err, count) => {
                        callback(err, count);
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