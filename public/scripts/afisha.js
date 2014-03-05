$(document).ready(function() {
	var tags = [];
	var $sort_items = $('.afisha_description_block, .afisha_item_block');

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

			if ($(this).data('clicked')) {
				tags.push(tag);

				$(tag).off('mouseout');
				$sort_items.not(':has(' + tag + ')').slideUp('600');
			}
			else {
				tags.splice(tags.indexOf(tag), 1);
				var s_tags = tags.join(', ');

				if (tags.length != 0)
					$sort_items.has(s_tags).not(':has(' + tag + ')').slideDown('600');
				else
					$sort_items.not(':has(' + tag + ')').slideDown('600');

				$(tag).on('mouseout', function() {
					$(tag).removeAttr('style');
				});
			}
		}
	});

	// Tickets

	// $('.afisha_ticket').click(function(event) {
	// 	$(this).children('a').clone().appendTo('.maket');
	// });
});