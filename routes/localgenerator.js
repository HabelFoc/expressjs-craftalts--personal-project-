module.exports = (router) => {


	router.get('/generate/localgenerator', (req, res) => {

		if(!req.session.user){
			req.session.loginMsg = 'Please login or register in order to use our service';
			res.redirect('/login');
		}else{
			res.render('generate/localgenerator', {
				title: 'Local Generator',
				user: req.session.user,
				displayName: req.session.displayName,
				userAvatar: req.session.userAvatar,
				stylesheet: '/css/style.css',
				stylesheet2: '/css/localgenerator.css',
				script: '/js/main.js',
				script2: '/js/localgenerator.js'
			});	
		}
		

	}); // END OF '/generate/chosengenerator' route


	// @route 	POST '/chosegenerator/loadgeneratorlist'
	// @desc 	Display/Load Top Generator For the Week
	router.post('/localgenerator/loadgeneratorlist', (req, res) => {

		// @TODO
		// LOGIC HERE (to pull list of generator for the week base on (upvote they get) / totalUsers) )


	}); // END OF '/chosegenerator/loadgeneratorlist' route


} // END OF exporting routes