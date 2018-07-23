$(document).ready(() => {
	
	// DOM
	const preLoader = $('#preloader');
	const loginBtn = $('#loginBtn');


	// Events listener
	loginBtn.on('click', loginBtnPressed)


	/* FUNCTIONS */
	function loginBtnPressed(){
		preLoader.addClass('active');
		loginBtn.addClass('disabled');
	}

});