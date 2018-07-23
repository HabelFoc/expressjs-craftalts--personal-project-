
$(document).ready(() => {

	// // firebase config
	// firebase.initializeApp(firebasePublicAPI);
	// // sign test
	// firebase.auth().signInWithEmailAndPassword('test@test.com', 'password321')
	// .then((err) => {
	// 	if(err){console.log(err)}
	// 		console.log('signIn?')
	// })
	
	// Navbar dropdown menu
	$('.dropdown-trigger').dropdown();

	// Mobile sidenav trigger
	$('.sidenav').sidenav();

	// Modal trigger
	$('.modal').modal();

	// Tooltip trigger
	$('.tooltipped').tooltip();
	
	// disable spellcheck on all inputs
	$(':input').attr('spellcheck', 'false');
	$(':input').attr('autocomplete', 'off');


	/* Copyright Footer */
	// Year make
	var yearMake = '2018';
	// Get current year
	var presentYear = new Date().getFullYear();
	$('#year-make-until-present').text(` ${yearMake} - ${presentYear} `);

});