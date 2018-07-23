// Get 'Alt' Model
const Alt = require('../models/Alt');
const axios = require('axios');
const { DB } = require('./firebase_modules');

module.exports = (router) => {


	// @route 	GET '/generate/globalgenerator'
	// @desc 	Global Generator

	router.get('/generate/globalgenerator', (req, res) => {

		// check if user loggedIn or not
		if(req.session.user === undefined){
			req.session.loginMsg = 'Please login or register in order to use our service';
			res.redirect('/login');
		}else{
			res.render('generate/globalgenerator', 
				{ title: 'Global Generator',
				 user: req.session.user,
				 displayName: req.session.displayName,
			 	 userAvatar: req.session.userAvatar,
				 script: '/js/main.js',
				 script2: '/js/globalgenerator.js',
				  stylesheet: '/css/style.css',
				   stylesheet2: '/css/globalgenerator.css'
			});
		}

	}); // End of '/generate' route


/* HELPER FUNCTION */

let genQouta = 0;

// decrease (-1) 'genQouta' helper funct
async function getGenQouta(currentUserId){
	await DB.collection('users').doc(currentUserId).get().then(async (doc) => {
		if(!doc.exists){
			console.log('No document found');
		}else{
			
			genQouta = doc.data().genQouta;
			console.log('local genQouta now is:', genQouta);

		}

	});

} // END OF 'getGenQoutaAndPrivilege' funct

// Get update gen replenishing stats each time user request,
// if meet condition, restore user genQouta
async function getReplenishingUpdate(currentUserId){
		try{
			await DB.collection('users').doc(currentUserId).get().then(doc => {
			if(!doc.exists){
				console.log('documents not found')
			}else{
				const theGenReplenish = doc.data().genReplenish;

					// check if genReplenishing has been initialize
					if(theGenReplenish){

						// check if, 'genReplenished' timestamp is already passed 24 hours
						const timefromdb = theGenReplenish;

						const diff = Math.floor(Date.now() / 1000) - timefromdb;

						// then restore 'userGenQouta' 
						if(diff > 86400){
							// if it more than 24 hours, restore user 'genQouta'
							console.log('24 hours passed')
							DB.collection('users').doc(currentUserId).set({
								genQouta: 4
							}, { merge: true });
							console.log('user genQouta has been restored!')
							genQouta = 4;
						}else{
							console.log('Its less than 24 hours')
						}

					}else{

						console.log('genReplenish document not initialize yet...')

					} // END OF else/if

			} // END OF else/if

		}); // END OF firestore collection reference

	}catch(err){

		console.log('error on getReplenishingUpdate');

	} // END OF try/catch block
	

} // END OF 'getReplenishingUpdate' funct

async function decGenQouta(currentUserId){
	// decrease user genQouta each request (either fail or success)
	// firestore db
	// reference by current user (session)
	genQouta--;
	await DB.collection('users').doc(currentUserId).update({
		genQouta: genQouta
	}); // only updated the chosen field

	// Set gen replenishing date if 'genQouta' == 0
	if(genQouta == 0){
		await DB.collection('users').doc(currentUserId).set({
				genReplenish: Math.floor(Date.now() / 1000)
			}, { merge: true });

		console.log('genReplenishing date has been set...')
	}
	
} // END OF 'decGenQouta' funct

/* END OF HELPER FUNCTION */

	// @route 	POST 
	// @desc 	Generate Alt Based on Given Term
	// 
	router.post('/globalgenerator/startgenerate', (req, res) => {

		let prevId;

		// 'startGenerateRandomAlt' helper function
		startGenerateRandomAlt();
		async function startGenerateRandomAlt(){

			// start getting user qouta
			await getGenQouta(req.session.user);

			// array of alts id
			let altIDs= [];

			// retrieve all alts first
			Alt.find({}).then(async item => {
				console.log(item)
				// store alts id in array
				await Promise.all(item.map(async item => {
					await altIDs.push(item.id)
				}))

				// // shuffle array items algorithm (from stackoverflow)
				// function shuffle(a) {
				//     var j, x, i;
				//     for (i = a.length - 1; i > 0; i--) {
				//         j = Math.floor(Math.random() * (i + 1));
				//         x = a[i];
				//         a[i] = a[j];
				//         a[j] = x;
				//     }
				//     return a;
				// }
				// // Shuffle it!
				//  // altIDs = await shuffle(altIDs);

				// start picking id
				actualPickId();
				function actualPickId(){

					console.log('total items:',altIDs.length)

					// Randomize chosen id
					const idPick = Math.floor(Math.random() * altIDs.length);

					if(idPick == prevId){
						// if previous generated id is == new generated id, generate new one again!
						console.log('id is same');
						actualPickId();
					}else{
							Alt.findById(altIDs[idPick]).then(item => {

							const body = {
							    "agent": {                              
							        "name": "Minecraft",               
							        "version": 1.12                     
							                                           
							    },
							    "username": item.email,     
							                                            
							    "password": item.password,
							    "clientToken": "client identifier",    
							    "requestUser": true                    
							}

							let skinID = '';

							// mojang auth
							axios({
							  method: 'post',
							  url: 'https://authserver.mojang.com/authenticate',
							  data: body
							})
							.then(async (response) => {
								skinID = response.data.selectedProfile.id;
								console.log('Axios request successfull');

								// prevId became the current 'successfull' id
								prevId = idPick;

								// Decreased qouta by 1 
								await decGenQouta(req.session.user);
								res.json({ success: true, alt: item, skinID: skinID, genQouta: genQouta });
								
							})		
							.catch(async (err) => {
								console.log('An axios request failed');

								// prevId became the current 'failed' id as well :)
								prevId = idPick;

								// Decreased qouta by 1 
								await decGenQouta(req.session.user);							
								res.json({ success: false, alt: item, skinID: skinID, genQouta: genQouta });
								
							}); // END OF axios request		
							
						})
						.catch(err => {
							console.log('Failed find by id')
							res.json({ success: false });

						}); // END OF 'findById'

					} // END OF 'else' statement

				} // END OF 'actualPickId' funct

			})
			.catch(err => {

				console.log('Failed to fetch all alts');
				res.json({ success: false });

			}); // END OF 'find({})' 

		} // END OF 'startGenerateRandomAlt' funct

	}); // END OF '/generate/startgenerate' route


	// @route 	POST /generate/checkqouta
	// @desc 	Retrieve User Generate Qouta
	router.post('/globalgenerator/checkqouta', (req,res) => {

		getQouta();
		async function getQouta(){
			await getGenQouta(req.session.user);
			await getReplenishingUpdate(req.session.user);
			res.json({ totalQouta: genQouta });
		}
		

	}); // END OF '/generate/checkqouta'

} // END OF exporting 'generate' routes