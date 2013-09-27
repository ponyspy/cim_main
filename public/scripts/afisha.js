$(document).ready(function() {
	$('.tag').hover(function() {
		var tag = '.' + this.className.slice(4);

		$(tag).css('background-color', 'red');
	}, function() {
		$('.tag').css('background-color', 'black');
	});

	$('.tag').click(function(event) {
		var tag = '.' + this.className.slice(4);

		$('.afisha_description_block, .afisha_item_block').not(':has(' + tag + ')').slideUp('slow');
	});

	$('.afisha_date_block').click(function(event) {
		$('.afisha_description_block:hidden, .afisha_item_block:hidden').slideDown('slow');
	});
});