// Get 'Alt' Model
const Alt = require('../models/Alt');

module.exports = (router) => {

	// @route 	GET /upload
	// @desc 	Generate upload page
	router.get('/upload', (req, res) => {

		// check if any user logged in (if logged, redirect to home page)
		if(!req.session.user){
			req.session.loginMsg = 'Please login or register on order to use our service';
			res.redirect('/login');
		}else{
			// if 'DarkLord' then hava a authorization
				res.render('upload',
			 { title: 'Upload',
			 	msg: 'Upload Alts',
			 	uploadError: req.session.uploadError,
				user: req.session.user,
				uploadMsg: req.session.uploadMsg,
				displayName: req.session.displayName,
				userAvatar: req.session.userAvatar,
			  	script: '/js/main.js',
			   	script2: '/js/upload.js',
			   	stylesheet: '/css/style.css',
			   	stylesheet2: '/css/upload.css'
			    });

			// reset errors msg/quickMsg
			req.session.uploadError = null;
			req.session.uploadMsg = null;

		} // END OF 'else/if'

	}); // END OF '/upload' route


	// @route 	POST /upload/startupload
	// @desc 	Upload list of minecraft alts
	router.post('/upload/startupload', (req, res) => {

		let totalFail = 0;
		// current user reference
		const currentUser = req.session.user;

		// Track percentages of account validity (determine by mojang auth)
		let totalAccountInserted = 0;
		let totalAccountValid = 0;
		let totalAccountInvalid = 0

		startSavingToMongo();
		// Star saving to mongoDB
		// Map each item and save to db (slow eh?)
		async function startSavingToMongo(){
			try {

				// wait till all data has been saved
				await Promise.all(req.body.alts.map(async (item) => {

					await new Alt({...item, altOwner: currentUser }).save()
						.then(() => console.log('Alt Saved!'))
						.catch(err => {
							totalFail++;
							console.log('Failed to save alt ', err.message);
						});

					/* Account Validation */
					// validate each inserted account (mojang authenticate)

				}));
				if (totalFail <= 0){
					res.json({ success: true });
				}else{
					res.json({ success: false, totalFail });
				}

			} catch (err) {
				console.log(err);
				res.json({ success: false, serverError: true });
			}		
		}

	});


	// @route 	POST /upload/resetdb
	// @desc 	Delete All Records
	router.post('/upload/resetdb', (req, res) => {
		Alt.find({}).remove().then(() => {
			console.log('All Data Has Been Removed')
			res.json({ success: true })
		})
		.catch(err => {
			console.log(err)
			res.json({ success: false })
		})
	})


}