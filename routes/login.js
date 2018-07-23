// 'express-validator'
const { check } = require('express-validator/check');

// firebaseAuth (from 'firebase_modules.js')
const { firebaseAuth, verifyToken } = require('./firebase_modules');


module.exports = (router) => {

	// @route 	GET /login
	// @desc 	Render Login Page
	router.get('/login', (req,res) => {

		// check if any user logged in (if logged, redirect to home page)
		if(!req.session.user){
			res.render('login', {
				title: 'Login',
				loginError: req.session.loginError,
				user: req.session.user,
				loginMsg: req.session.loginMsg,
				script: '/js/main.js',
				script2: '/js/login.js',
				stylesheet: '/css/style.css',
				stylesheet2: '/css/login.css'
			});

			// // reset errors message each time page has loaded
			req.session.loginError = null;
			req.session.loginMsg = null;
		}else{
			res.redirect('/')
		}

	}); // End of '/login' route


	// @route 	POST /login/startlogin
	// @desc 	Login User
	router.post('/login/startlogin', (req,res) => {

		// Get body values
		const email = req.body.email;
		const password = req.body.pwd;

		// Setup validation (express-validator)
		// sanitize all inputs
		req.check('email').trim().escape().normalizeEmail();
		req.check('pwd').trim().escape();

		// check empty field
		req.check('email', 'Email is required').notEmpty();
		req.check('pwd', 'Password is required').notEmpty();

		// check email address (if valid email)
		req.check('email', 'Invalid email address').isEmail();

		// Start validation
		req.getValidationResult().then(async (result) => {
			// display errors message (if any)
			if(!result.isEmpty()){
					// store errors in session
					req.session.loginError = { errors: result.array() };
					// result.array().forEach((item) => {
					// 	console.log(item.msg)
					// })
				// redirect to '/login' again
				res.redirect('/login');
			}else{

				// start firebase login
				await firebaseAuth
				.signInWithEmail(email, password, async (err, result) => {
						if(err){
							console.log('Firebase signIn fail...');
							req.session.loginError = { 
								errors: [{ msg:'Invalid credentials' }]
							};
							res.redirect('/login')
						}else{
							/* Start user login... */
							// token verification
							const verifyUser = await verifyToken(result.token);
							
							// clear errors msg 
							req.session.loginError = null;
							req.session.loginMsg = null;


							// store user session
							let [ 
								userUid,
								userName,
								userPics
							 ] = await Promise.all([
							 		verifyUser.uid,
							 		verifyUser.name,
							 		verifyUser.picture
							 	])

							
							req.session.user = userUid;
							req.session.displayName = userName;
							req.session.userAvatar = userPics;

						
							// upon successful, redirect to home page
							res.redirect('/')

						} // End of 'else/if'

					} // End of 'firebaseAuth' callback

				); // End of 'firebaseAuth'

			} // End of 'else/if' statement

		}); // End of 'getValidationResult'

	}); // End of '/login/startlogin' route

} // END OF exporting routes