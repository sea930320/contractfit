'use strict';

//----------importing modules------------

const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const htmlspecialchars = require('htmlspecialchars');
const expressValidator = require('express-validator');
const mailer = require('express-mailer');
const fileUpload = require('express-fileupload');
const requestIp = require('request-ip');

//-----------------mongodb---------------
//importing cofig info
const db = require('./app/config/database');
const db_url = process.env.NODE_ENV ? db.production.url : db.development.url;
//connect to mongodb
mongoose.Promise = global.Promise;
mongoose.connect(db_url, {
	useMongoClient: true
});
//on connection
mongoose.connection.on('connected', ()=> {
	console.log('Connected to Database mongodb');
})
//db connection error hook
mongoose.connection.on('error', (err)=> {
	if (err) {
		console.log("Error in Database connection:" + err);	
	}
})

//---------app configuration-------------
const app = express();
//port no
const port = process.env.PORT || 5030;
//mailer configuration
mailer.extend(app, require("./app/config/email"));
//init global variable
global.__basedir = __dirname;
global.global_data = new Array();
global.sprintf = require('sprintf-js').sprintf;
global.vsprintf = require('sprintf-js').vsprintf;
global.htmlspecialchars = htmlspecialchars;
global.dir_conf = require('./app/config/config');
global.isset = require('isset');
//app locals set
app.locals = {
	helpers: require('./app/helpers/helpers'),
	customValidator : require("./app/helpers/custom_validator"),
	customSanitizer : require("./app/helpers/custom_sanitizer"),
};
//importing gettext module
const gettextModule = require('./app/library/gettext');
gettextModule();

//rendering engine set
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'app/views'));

//----------adding middlewares------------
//Compress all routes
app.use(compression());
//Using Helmet to protect against well known vulnerabilities
app.use(helmet());
//cors
app.use(cors());
//session secret
var sess = {
	secret: '5d0J28UYBqo4LnaYUl57NEUw5V2nJtR9',
	cookie: {
		httpOnly: false
	},
	resave: true,
	saveUninitialized: true
}
if (app.get('env') === 'production') {
	app.set('trust proxy', 1);
	sess.cookie.secure = true;
}
app.use(session(sess));
//body - parser
//parse application/json
app.use(bodyParser.json());
//parse application/vnd.api+json as json
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true}));
//cookie - parser
app.use(cookieParser());
//fileupload
app.use(fileUpload());
//parse form-validator
app.use(expressValidator({
	customValidators: customValidator,
	customSanitizers: customSanitizer
}));
//request ip getter
app.use(requestIp.mw())
//static files
app.use(express.static(path.join(__dirname, 'app/views')));
app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'mounts')));
// app.use(express.static('/mounts'));
//base middleware
const base_middleware = require('./app/routes/base_middleware');
app.use(base_middleware);

//------------routes-------------------
const route = require('./app/routes/route');
const StaticPagesController = require('./app/controllers/Static_pages');

app.use(/^\/(en|fr|nl)/, route);

//-------------testing Server-------------
app.get('/foobar', (req, res) => {
	res.send('foobar');
})

app.listen(port, () => {	
	console.log('Contractfit Server started at port:' + port);
});

//shoutout to the user
// console.log('Magic happens on port ' + port);

//expose app
exports = module.exports = app;