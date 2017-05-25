var Club = require('../models/clubs');
var formidable = require('formidable');
var path = require('path');
var fs = require('fs');

module.exports = (app) => {
    
    app.get('/dashboard', (req, res) => {
        res.render('admin/dashboard');
    });
    
    app.post('/dashboard', (req, res, next) => {
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
}