module.exports = (router) => {


	// @route 	GET /logout
	// @desc 	Sign Out Current User
	router.get('/logout', (req,res) => {

		// destroy any session & redirect to home page
		if(req.session.user === undefined){
			req.session.destroy();
			res.redirect('/')
		}else{
			req.session.destroy((err) => {
				if(err) throw err;
				console.log('sessions destroyed!');
				res.redirect('/');
			});
			
		}
		
	});

}