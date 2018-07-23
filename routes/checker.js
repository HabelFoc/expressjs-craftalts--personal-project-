module.exports = (router) => {

	router.get('/checker', (req, res) => {

		console.log('user token is: ',req.session.user)

		res.render('checker',
		 { title: 'Checker',
		 	msg: 'Comming Soon',
		 	user: req.session.user,
		 	displayName: req.session.displayName,
			userAvatar: req.session.userAvatar,
		  	script: '/js/main.js',
		   	script2: '/js/checker.js',
		   	stylesheet: '/css/style.css',
		   	stylesheet2: '/css/checker.css'
		    })
	})

}