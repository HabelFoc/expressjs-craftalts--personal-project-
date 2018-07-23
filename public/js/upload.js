$(document).ready(() => {

	// DOM elements
	var uploadBtn = $('#uploadbtn'); 
	var preLoader = $('#preloader');
	var successMsg = $('#successmsg');
	var altListArea = $('#altlist');
	var resetDBBtn = $('#resetdbbtn');

	// Email Validation Helper function
	function isEmail(email) {
	  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	  return regex.test(email);
	}

	// reset db class
	class Reset {
		constructor(){}
		reset(){
			console.log('deleting database...')
			$.post('/upload/resetdb', {}, (response) => {
				console.log('database deleted')
				console.log(response)
			});
		}
	}

	resetDBBtn.on('click', () => new Reset().reset());

	// Events Listener
	uploadBtn.on('click', startUpload);

	// Star Upload Validation
	function startUpload(){
		// activity indicator
		preLoader.addClass('progress');
		successMsg.removeClass('active');

			var list = altListArea.val().trim();

			var lists = list+'\n';

			var startPos = 0;
			var findPos = 0;
			var newLinePos = 0;

			var email = '';
			var password = '';
			var emailFailedCount = 0;
			var passwordFailedCount = 0;
			var Somethingwentwrong = false;
			var failedCount = 0;

			var alts = [];

			console.log(lists.indexOf('\n'));
			console.log(lists.indexOf(':', startPos));

			if (lists.indexOf(':', startPos) != -1) {
				
				while (
					lists.indexOf(':', startPos) != -1 &&
					lists.indexOf('\n', newLinePos) != -1
				) {
					findPos = lists.indexOf(':', startPos);

					// Get email substring
					email = lists.substring(startPos, findPos);

					// validate each email
					if (!isEmail(email)) {
						emailFailedCount++;
					}

					// Get password substring
					password = lists.substring(
						findPos + 1,
						lists.indexOf('\n', newLinePos),
					);

					// validate each password
					if (password.search(' ') != -1) {
						console.log(password.search(' '))
						passwordFailedCount++;
					}

					// Push to altArray
					alts.push({ email: email, password: password });

					newLinePos = lists.indexOf('\n', newLinePos) + 1;

					startPos = newLinePos;
				}

			}else{
				successMsg.addClass('active');
				successMsg
					.children(':first')
					.addClass('red-text')
					.text('Invalid Format :(');
				preLoader.removeClass('progress');
				failedCount++;
			}

			// start validate input
			if (emailFailedCount > 0 || passwordFailedCount > 0) {
				successMsg.addClass('active');
				successMsg
					.children(':first')
					.removeClass('green-text')
					.addClass('red-text')
					.text('Invalid Format :(');
				preLoader.removeClass('progress');
			} else {
				if (lists != '' && failedCount <= 0) {
					// clear textarea
					altListArea.val('');
					// request save to mongoDb after inputs has been validated
					$.post('/upload/startupload', { alts: alts }, (response) => {
						console.log(response);
						if (response.success){
							preLoader.removeClass('progress');
							successMsg.addClass('active');
							successMsg
								.children(':first')
								.removeClass('red-text')
								.addClass('green-text')
								.text(`Success! Thank you for you contribution :)`);
							altListArea.val('');
						}else{
							successMsg.addClass('active');
							successMsg
								.children(':first')
								.removeClass('green-text')
								.addClass('red-text')
								.text(`${(response.serverError) ? "Server Error":`Failed to save some data or insterted item already exist ${(response.totalFail) ? 'Failed: '+response.totalFail:''}`}`);
							preLoader.removeClass('progress');
						}	
					});

				} else {
					successMsg.addClass('active');
					successMsg
						.children(':first')
						.removeClass('green-text')
						.addClass('red-text')
						.text('Please fill in your alt list');
					preLoader.removeClass('progress');
				}
			}
	} // end of 'startUpload' function

})