$(document).ready(function() {
	var tags = [];
	var $sort_items = $('.afisha_description_block, .afisha_item_block');

	$.ajax({
  	url: 'https://tickets.meyerhold.ru/api/?secret=532ae7e4ba662f1402000003&d1=2015-02-01&d2=2015-02-28',
  	dataType: 'json',
  	crossDomain: 'true',
   	xhrFields: {
			withCredentials: true
   	}
	}).done(function(data) {
		console.log(data)
	});

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
});