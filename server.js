var compression = require('compression');
var express = require('express');
var path = require('path');
var http = require('http');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var validator = require('express-validator');
var ejs = require('ejs');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var engine = require('ejs-mate');
var socketIO = require('socket.io');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var moment = require('moment');
var cutstring = require('./functions/func');
var helmet = require('helmet');
var MongoClient = require('mongodb').MongoClient;

var app = express();

app.use(compression())
app.use(helmet());

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);
//mongoose.connect('mongodb://localhost/soccerchat');

mongoose.connection.on("open", function() {
    //console.log("connection to database done!");
});

mongoose.connection.on("error", function() {
    //console.log("error");
});


var server = http.createServer(app);
var io = socketIO(server);

require('./config/passport');

app.use(express.static('public'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.use(cookieParser());

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(validator());

app.use(validator({
 customValidators: {
    noSpace: function(value) {
        return value.trim().length > 0
    }
 }
}));

app.use(session({
    secret: process.env.SECRET_COOKIE_SECRET,
    //secret: 'Thisismytestkey',
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({mongooseConnection: mongoose.connection})
}));

app.use(flash());

app.locals.ejs = ejs;

app.use(passport.initialize());
app.use(passport.session());


app.locals.moment = moment;
app.locals.cutstring = cutstring;
            

require('./config/socket')(io);
require('./config/private')(io);
require('./config/msg')(io);
require('./config/friend')(io);
require('./config/login')(io);
require('./routes/user')(app, io, mongoose);
require('./routes/admin')(app);
require('./routes/profile')(app);
require('./routes/chat')(app);
require('./routes/reset')(app);
require('./routes/footballnews')(app);

require('./config/admin_passport');

server.listen(process.env.PORT || 3000, () => {
  console.log('Listening on Port 3000');
});

app.use(function(req, res){
	res.render('404');
});