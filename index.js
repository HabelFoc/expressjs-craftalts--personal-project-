const express = require('express');
const hbs = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const expressSession = require('express-session');
const fileUpload = require('express-fileupload');

// Activate ExpressJs
const app = express();

// Connect to MongoDB
const db = require('./config/keys').mongoURI;
function connectDB(){
	mongoose
	.connect(db)
	.then(() => console.log('MongoDB Connected...'))
	.catch(err => {
		console.log('Can\'t connect', err)
		setTimeout(() => connectDB(), 3000);
	});
}
connectDB();

// Setup session store
const mongoStore = require('connect-mongo')(expressSession);
app.use(expressSession({
	secret: 'xcizcxooizocziozpp',
	resave: false,
	saveUninitialized: false,
	store: new mongoStore({
		url: db
	})
}));


// Setup 'body-parser' Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// File upload
app.use(fileUpload())

// Setup 'express-validator'
app.use(expressValidator());

// Setup views engine 
app.engine('hbs', hbs({ extname:'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts/' }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Setup static files
app.use(express.static('./public'));

// Setup routes
app.use('/', require('./routes/index'));


// Handle 404 status
app.use((req, res, next) => {
  res.status(404).render('notfound', {
   		title: 'Not Found',
   		script: '/js/main.js',
   		stylesheet2: '/css/notfound.css'
	});
})

// Start listening port
app.listen(process.env.PORT || 3000, () => {
  console.log('Now listening on port localhost:3000')
});
