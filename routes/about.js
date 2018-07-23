module.exports = (router) => {

	// about 
	router.get('/about', (req, res) => {

		console.log('user token is: ',req.session.user)

		const data = {
			title: 'About',
			msg: 'CraftAlts is a minecraft services provider, providing minecraft accounts/alts to our player, while being (free). Our long term goals is to provider any possible in-game service to our minecraft player in the future. All we hope is, players can have have their best (if not least, "better") gameplay experience and hopefully make a moments.'
		};
		res.render('about',
		 { title: data.title,
		  	msg: data.msg,
		  	user: req.session.user,
		  	displayName: req.session.displayName,
		  	userAvatar: req.session.userAvatar,
		   	script: '/js/main.js',
		    script2: '/js/about.js',
		    stylesheet: '/css/style.css',
		    stylesheet2: '/css/about.css'
		     });

	})
	
}

	