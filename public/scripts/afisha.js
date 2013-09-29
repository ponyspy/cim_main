$(document).ready(function() {

	function setColor(event) {
		var tag = '.' + this.className.slice(4);
		$(tag).css('background-color', event.data.color);
	}

	$('.tag').on('mouseover', {color: 'red'}, setColor);
	$('.tag').on('mouseout', {color: 'black'}, setColor);

	$('.tag').click(function(event) {
		var tag = '.' + this.className.slice(4);
		$(this).data('clicked', !$(this).data('clicked'));

		if ($(this).data('clicked')) {
			$(tag).off('mouseout');
			$('.afisha_description_block, .afisha_item_block').not(':has(' + tag + ')').slideUp('slow');
		}
		else {
			$(tag).css('background-color', 'black');
			$(tag).on('mouseout', {color: 'black'}, setColor);
			$('.afisha_description_block, .afisha_item_block').not(':has(' + tag + ')').slideDown('slow');
		}
	});
});