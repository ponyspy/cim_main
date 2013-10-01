$(document).ready(function() {

	function setColor(event) {
		var tag = '.' + this.className.slice(4);
		$(tag).css('background-color', event.data.color);
	}

	$('.tag').on('mouseover', {color: 'red'}, setColor);
	$('.tag').on('mouseout', {color: 'black'}, setColor);

	// $('.afisha_item_block').each(function(index) {
	//    $(this).is(":visible") ? $(this).height($(this).height()) : $(this).height(0);
	// });

	$('.tag').click(function(event) {
		var tag = '.' + this.className.slice(4);
		$(this).data('clicked', !$(this).data('clicked'));
		$('.afisha_description_block, .afisha_item_block').not(':has(' + tag + ')').slideToggle('slow');

		if ($(this).data('clicked')) {
			$(tag).off('mouseout');
		}
		else {
			$(tag).on('mouseout', {color: 'black'}, setColor);
		}
	});
});