module.exports = (router) => {


	// @route 	GET '/generate'
	// @desc 	Display 'Generate' Dashboard
	router.get('/generate', (req, res) => {

		res.render('generate', {
			title: 'Generate',
			user: req.session.user,
			displayName: req.session.displayName,
			userAvatar: req.session.userAvatar,
			script: '/js/main.js',
			script2: '/js/generate.js',
			stylesheet: '/css/style.css',
			stylesheet2: '/css/generate.css'
		});

	}); // END OF '/generate' route


} // END OF exporting routes