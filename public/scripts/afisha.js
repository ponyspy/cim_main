$(document).ready(function() {
	// $('.afisha_item_block').css('height', $('.afisha_item_block').height());
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
			// $('.afisha_description_block, .afisha_item_block').not(':has(' + tag + ')').slideToggle('600');

			if ($(this).data('clicked')) {
				tags.push(tag);

				$(tag).off('mouseout');
				$('.afisha_description_block, .afisha_item_block').not(':has(' + tag + ')').slideUp('600');
			}
			else {
				tags.splice(tags.indexOf(tag), 1);
				var s_tags = tags.join(', ');

				if (tags.length != 0)
					$('.afisha_description_block, .afisha_item_block').has(s_tags).not(':has(' + tag + ')').slideDown('600');
				else
					$('.afisha_description_block, .afisha_item_block').not(':has(' + tag + ')').slideDown('600');

				$(tag).on('mouseout', function() {
					$(tag).removeAttr('style');
				});
			}
		}
	});
});