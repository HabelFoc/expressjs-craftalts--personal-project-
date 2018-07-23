const express = require('express');
const router = express.Router();
const about = require('./about');
const generate = require('./generate');
const upload = require('./upload');
const checker = require('./checker');
const register = require('./register');
const globalgenerator = require('./globalgenerator');
const localgenerator = require('./localgenerator');
const login = require('./login');
const logout = require('./logout');

	// Home 
	router.get('/', (req, res) => {

		console.log('user session: ', req.session)

		const data = {
			title: 'CraftAlts',
			msg: 'Free Minecraft Alts Generator'
		};
		
		res.render('index', 
			{ title: data.title,
			 msg: data.msg,
			 user: req.session.user,
			 displayName: req.session.displayName,
			 userAvatar: req.session.userAvatar,
			  script: '/js/main.js',
			   stylesheet: '/css/style.css'
			    });

		

	})

	/* Register routes */
	
	// About page
	about(router);

	// Generate page
	generate(router);

	// Public Generator
	globalgenerator(router);

	// Chosen Generator
	localgenerator(router);

	// Upload page
	upload(router);

	// Checker page
	checker(router);

	// Register page
	register(router);

	// Login page
	login(router);

	// logout function
	logout(router);

module.exports = router;