const { check } = require('express-validator/check');

// firebaseAdmin (from 'firebase_modules.js');
const { firebaseAuth, DB } = require('./firebase_modules');

module.exports = (router) => {

	// @route 	GET /register
	// @desc 	Render Register Page
	router.get('/register', (req, res) => {

		// check if user is logged in (if true, redirect to home page)
		if(!req.session.user){
				res.render('register', {
				title: 'Register',
				registerErrors: req.session.registerErrors,
				user: req.session.user,
				registerMsg: req.session.registerMsg,
				script: '/js/main.js',
				script2: '/js/dist/register.bundle.js',
				stylesheet: '/css/style.css',
				stylesheet2: '/css/register.css'
			})

			// reset errors message each time page has loaded
			req.session.registerErrors = null;
			req.session.registerMsg = null;
		}else{
			res.redirect('/');
		}
	}); // End of '/register' route


	// @route 	POST /register/startregister
	// @desc 	Start Register User
	router.post('/register/startregister', (req,res) => {

		/** Inputs validation (express-validator)  **/
		// sanitize & check if 'fields' not empty
		req.check('username', 'Username required').trim().escape().notEmpty();
		req.check('email', 'Email required').trim().normalizeEmail().notEmpty();
		req.check('pwd', 'Password required').trim().notEmpty();
		req.check('confirm_pwd', 'Confirm password required').trim().notEmpty();

		// check if 'email' is valid
		req.check('email', 'Invalid email address').isEmail();

		// check if 'password/confirm password' is longer than 6 chars and contain number
		req.check('pwd', 'Passwords must be at least 6 chars long and contain one number')
		.isLength({ min: 6 }).matches(/\d/);

		// check if 'password' and 'confirm password' is equal
		req.check('confirm_pwd', 'Passwords not match').equals(req.body.pwd);

		// avatar url
		req.check('avatar_url', 'Avatar required').notEmpty();

		/* Now start checking all validation */
		req.getValidationResult().then(async result => {
			// check if any errors
			if(!result.isEmpty()){
				// display errors msg & redirect to '/register' again
				req.session.registerErrors = await { errors: result.array() };
				res.redirect('/register')
			}else{
				/* start register user (firebase) */
				// get body values
				const name = req.body.username;
				const email = req.body.email;
				const password = req.body.pwd;
				const photoUrl = req.body.avatar_url;
				console.log(req.body.avatar_url)
				// register with 'firebase email/password'
				let extras = {
					name: name,
    				photoUrl: photoUrl
				}
				firebaseAuth.registerWithEmail(email, password, extras, async (err, result) => {
					if(err){
						// if failed, redirect to '/register' & display errors
						req.session.registerErrors = { errors: [{ msg: 'A User Already Exists' }] };
						res.redirect('/register');
					}else{
						// if success, start storing user data in firestore
						console.log(result.user);
						const uid = result.user.id;
						const displayName = result.user.displayName;
						const avatarUrl = result.user.photoUrl;
						const genQouta = 4;
						const timeStamp = new Date().getTime(); // the get the timestamp

						DB.collection('users').doc(uid).set({
							name: displayName,
							genQouta: genQouta,
							firstLogin: timeStamp,
							avatarUrl: avatarUrl
						},{ merge: true })
						.then((data) => {
							console.log('register success!')

						}); // END OF firestore collection call		

						// clear register errors session (if any)
						req.session.registerErrors = null;
						req.session.registerMsg = null

						// start setting up user session
						let [
							userUid,
							userName,
							userPics
						] = await Promise.all([
								uid,
								displayName,
								avatarUrl
							]);


						req.session.user = userUid;
						req.session.displayName = userName;
						req.session.userAvatar = userPics;

						res.redirect('/');				

					} // END OF 'else'

				}); // ENF OF 'firebaseAuth'
				
			} // End of 'if(result.isEmpty())'
			
		}); // End of 'getValidationResult'

	}) // End of '/register/startregister' route

} //  End of exporting routes


