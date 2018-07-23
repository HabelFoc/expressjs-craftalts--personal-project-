// Setup Firebase admin SDK
const firebaseAdmin = require('firebase-admin');
const firebaseServiceAccount = require('../config/keys').adminSdkPrivateKey;
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(firebaseServiceAccount),
  databaseURL: 'https://craftalts-4f42a.firebaseio.com'
});

// Setup 'firebaseauth'
const FirebaseAuth = require('firebaseauth');
const firebaseAuth = new FirebaseAuth(require('../config/keys').firebasePublicAPI.apiKey);


// Verify Token Helper function
const verifyToken = async (IdToken) => {
	let user;
	await firebaseAdmin.auth().verifyIdToken(IdToken)
		.then((decodedToken) => {
			const uid = decodedToken.uid;

			console.log('Token verified')
			user = decodedToken;
		})
		.catch((error) => {
			console.log('verifyToken failed');
		}); // End of 'verifiyIdToken'
	return user;
}


/* Initialize firestore */
const DB = firebaseAdmin.firestore();

// named exports
module.exports = {
	verifyToken,
	firebaseAuth,
	DB
}