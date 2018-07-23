$(document).ready(() => {


	// DOM
	const choseBtn = $('#chosebtn');
	

	// Initial Trigger
	(async loadGeneratorList => {	

		// get generator list
		$.post('/localgenerator/loadgeneratorlist', { data: data }, (response) => {

			console.log(response);

		}); // END OF 'post' request

	})();

	// EVENT LISTENER
	choseBtn.on('click', choseClicked);



	// FUNCTIONS
	function choseClicked(e){
		e.preventDefault();
	}


})//  END OF 'document ready'