$(document).ready(function() {
	$('.afisha_item_block').css('height', $('.afisha_item_block').height());
	var tags = [];

	$('.tag').on({
		mouseover: function() {
			var tag = '.' + this.className.slice(4);
			$(tag).css('background-color', 'red');
		},
		mouseout: function() {
			var tag = '.' + this.className.slice(4);
			$(tag).removeAttr('style');
		},
		click: function() {
			var tag = '.' + this.className.slice(4);

			$(tag).data('clicked', !$(tag).data('clicked'));
			$('.afisha_description_block, .afisha_item_block').not(':has(' + tag + ')').slideToggle('600');

			if ($(this).data('clicked')) {
				$(tag).off('mouseout');
				// $('.afisha_description_block, .afisha_item_block').not(':has(' + tag + ')').addClass('hide').slideUp('600');
			}
			else {
				$(tag).on('mouseout', function() {
					$(tag).removeAttr('style');
					// $('.afisha_description_block, .afisha_item_block').not(':has(' + tag + ')').filter('.hide').slideDown('600');
					// $('.hide').not(':has(' + tag + ')').slideDown('600');
				});
			}
		}
	});
});