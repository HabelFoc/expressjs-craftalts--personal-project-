$(document).ready(() => {

	// DOM
	var email = $('#email');
	var password = $('#password');
	var playerSkin = $('#player-skin');
	var playerBody = $('#player-body');
	var genBtn = $('#gen-btn');
	var preLoader = $('#preloader');
	var errorMsg = $('#errormsg');
	var generateBtn = $('#generateBtn');
	var msgInfo = $('#msginfo');
	var passwordIcon = $('#pwdicon');

	/* remove 'container' and 'row' class */
	var containerTop = $('#containerTop');
	var inner = $('#inner');
	var rowBox1 = $('#row-box1')

	rmTargetEl();

	// listen for window
	$(window).on('resize', () => {
		rmTargetEl();
	})

	function rmTargetEl(){
		if ( $(this).width() <= 568){
			rowBox1.removeClass('row');
		}else{
			rowBox1.addClass('row');
		}
	}

	/* end of removing 'container' and 'row' */

	var totalFetchFail = 0;
	var totalfetchQouta = 3; // on fail request qouta (after that user need to wait an hour (for unique user))
	var userRequestqouta = 3; // request qouta (counts when 'success')
	var qoutaCounter = 0;

	// check user gen qouta first (auto invoke funct)
	// then enable gen button if qouta still up
	(async function checkUserGen(){
		
		preLoader.addClass('active'); // indicate generator still processing
		errorMsg.addClass('green-text');
		errorMsg.text('getting things ready...');
		errorMsg.slideDown();

		await $.post('/globalgenerator/checkqouta', { params: 'aweasdaw' }, (response) => {
				if(response.totalQouta === 0){
					console.log(response)
					preLoader.removeClass('active');
					generateBtn.addClass('disabled');
					msgInfo.css('display', 'block');

					errorMsg.slideUp();
				}else{
					console.log(response)
					preLoader.removeClass('active');
					generateBtn.removeClass('disabled');

					errorMsg.slideUp();
				}
			});
	})();

	// Generate button 
	generateBtn.on('click', startGenerate);
	// Copy input value to clipboard
	$(':input[type="text"]').on('focus', (e) => {
		e.target.select();
		document.execCommand("copy");
		M.toast({html: `Copied: ${e.target.value}`});
	})
	// For Password Icons (fix password input not selected)
	passwordIcon.on('click', () => {
		password.select();
	})

	// StartGenerate function
	function startGenerate(){
		// show loading ui
		generateBtn.addClass('disabled')
		preLoader.addClass('active');
		// if(document.getElementById('generateBtn').classList.contains('disabled')){			
		// }

		// show loading indicator and remove any error msg
		preLoader.addClass('active');
		errorMsg.slideUp();

		var randTerm = Math.floor((Math.random() * 2));
		var defaultPlayerSkin = '';
		if(randTerm > 0){
			defaultPlayerSkin = '8667ba71b85a4004af54457a9734eed7'
		}else{
			defaultPlayerSkin = '64f55a4f5783476380b488c29949b37a';
		}

		// trigger actual fetch
		actualFetch()

		// Start fetching new alt
		function actualFetch(){
			$.post('/globalgenerator/startgenerate', { randTerm }, (response) => {
				console.log(response);
				// When response came
				if(response.success || response.alt != null){
					var altEmail = response.alt.email;
					var altPassword = response.alt.password;
					var altID = response.skinID;
					
					var faceUrl = `https://crafatar.com/avatars/${altID}?size=100`;
					var bodyUrl = `https://crafatar.com/renders/body/${altID}`;
					// populate UI
					email.val(altEmail);
					password.val(altPassword);
					// use steve skin if skinUrl not provided
					if(altID != ""){
						playerSkin.attr('src', faceUrl);
						playerBody.attr('src', bodyUrl);
					}else{
						playerSkin.attr('src', `https://crafatar.com/avatars/${defaultPlayerSkin}?size=100`);
						playerBody.attr('src', `https://crafatar.com/renders/body/${defaultPlayerSkin}`);
					}
					errorMsg.removeClass('red-text')
					errorMsg.addClass('green-text')
					errorMsg.text('Success')
					errorMsg.slideDown();
					preLoader.removeClass('active');
					generateBtn.removeClass('disabled')
					qoutaCounter++;
					totalFetchFail=0;
					console.log('user qouta now is: ',response.genQouta)
					if(response.genQouta === 0){
						generateBtn.addClass('disabled')
						msgInfo.css('display', 'block');
					}
				}else{
					// populate UI
					console.log('Server error occurred...')
					// show 'still fetching...' msg if totalFetchFail >= 3 times
					errorMsg.removeClass('green-text')
					errorMsg.addClass('red-text')
					errorMsg.text('still fetching...')
					errorMsg.slideDown();

					// try again
					if(totalFetchFail <= totalfetchQouta){
						// re-trigger 'actualFetch' funct
						actualFetch();
					}else{
						errorMsg.removeClass('green-text')
						errorMsg.addClass('red-text')
						errorMsg.text('Failed to fetch some alt or to many invalid account :( Comeback later?')
						errorMsg.slideDown();
						preLoader.removeClass('active');
						setTimeout(() => location.reload(true), 3000);
					}
					totalFetchFail++;
				}

			});
		}

	} // end of 'startgenerate' function

});