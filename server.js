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


var port = process.env.PORT || 3000;

var app = express();

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/soccerchat');

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
}))

app.use(session({
    secret: 'Thisismytestkey',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({mongooseConnection: mongoose.connection})
}));

app.use(flash());

app.locals.ejs = ejs;

app.use(passport.initialize());
app.use(passport.session());

var server = http.createServer(app);
var io = socketIO(server);
var sio = io.of('/chat');

app.locals.moment = moment;
            

require('./config/socket')(io);
require('./config/private')(io);
require('./config/msg')(io);
require('./routes/user')(app);
require('./routes/admin')(app);
require('./routes/profile')(app);
require('./routes/chat')(app);

server.listen(port, () => {
  console.log('Listening on Port 3000');
});