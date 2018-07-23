const { firebasePublicAPI } = require('../../config/keys');

firebase.initializeApp(firebasePublicAPI);

$(document).ready(() => {

	// DOM
	const registerForm = $('#registerform');
	const preLoader = $('#preloader');
	const userAvatar = $('#user_avatar');
	const fileLimitMsg = $('#fileLimitMsg');
	const submitBtn = $('#submitbtn');

	// Events Listener
	registerForm.on('submit', registerSubmit);
	userAvatar.on('change', avatarOnChange);

	// Global varaibles
	let avatar_url = '';

	/* FUNCTIONS */
	// avatarOnChange funct
	function avatarOnChange(e){

		const file = e.target.files[0];
		const sizes = e.target.files[0].size;

		console.log(sizes)

		if(sizes > 1000000){
			fileLimitMsg.css('display', 'block');
		}else{
			preLoader.addClass('active')
			submitBtn.addClass('disabled');
			fileLimitMsg.css('display', 'none');
		

		// // upload file to server
		// var formData = new FormData();

		// // HTML file input, chosen by user
		// formData.append("avatar", file);

		// var request = new XMLHttpRequest();
		// request.open("POST", "/register/uploadavatar");
		// request.send(formData);

		// firebase storage ref
		var storageRef = firebase.storage().ref(`users_avatar/'${file.name}`);

		// Upload file
		var task = storageRef.put(file);

		// Update progress bar
		task.on('state_changed', 

			function progress(snapshot) {
				// var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				// myProgress.value = percentage;
			},

			function error(err) {
				console.log('Error has occurred: ', err);
			},

			function complete(data) {
				console.log('file uploaded!');

				/* populate avatar icon */
				const previewAvatar = $('#preview_avatar');
				// storageRef.child('images/stars.jpg').getDownloadURL().then(function(url) {
				// Get url from firebase storage
				storageRef.getDownloadURL().then((downloadedUrl) => {

					// populate avatar
					previewAvatar.attr('src', downloadedUrl)

					// store img reference for current user
					avatar_url = downloadedUrl;
					$('#avatarurl').val(avatar_url);

					preLoader.removeClass('active')
					submitBtn.removeClass('disabled');

				});
			} // END OF 'complete' funct

			); // END OF 'task' listener

		} // END OF 'else/if'

	} // END OF 'avatarOnChange' funct

	// registerSubmit funct
	function registerSubmit(e){
		submitBtn.removeClass('disabled');
		submitBtn.addClass('disabled');
		preLoader.addClass('active');
	}


}); // END OF 'ready document'