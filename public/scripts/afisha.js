$(document).ready(function() {
	$('.premiere').click(function(event) {
		$('.afisha_description_block:has(.premiere)').slideUp('slow');
	});

	$('.afisha_date_block').click(function(event) {
		$('.afisha_description_block:hidden').slideDown('slow');
	});
});