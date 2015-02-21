$(document).ready(function() {
	var tags = [];
	var $sort_items = $('.afisha_description_block, .afisha_item_block');

	var interval_start = $('.afisha_actual_block').attr('interval_start');
	var interval_end = $('.afisha_actual_block').attr('interval_end');
	var secret = '532ae7e4ba662f1402000003';

	$.ajax({
		url: 'https://tickets.meyerhold.ru/api/?secret=' + secret + '&d1=' + interval_start + '&d2=' + interval_end,
		dataType: 'jsonp',
		jsonp: 'jsonp'
	}).done(function(data) {
		data.tickets.forEach(function(ticket) {
			switch (ticket.status) {
				case 'available':
					$('.' + ticket.show_id).text('купить билет').attr('href', data.turl + ticket.tid);
				break;
				case 'sold':
					$('.' + ticket.show_id).text('проданны');
				break;
			}
		});
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