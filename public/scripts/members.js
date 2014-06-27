$(document).ready(function() {
	var set = $();
	var search = $('.member');

	$('.member').on({
		mouseover: function() {
			var cat = [];
			var categorys = this.className.split(' ');

			$.each(categorys, function(index, category) {
				cat.push('.' + category)
			});
			$('.categorys').children(cat.join(',')).css({'background-color': 'white', 'color': 'black'});
		},
		mouseout: function() {
			$('.categorys').children().removeAttr('style');
		}
	});

	// $('.members_column').on({
	// 	mousemove: function(event) {
	// 		$(this).scrollTop(event.pageY - 330);
	// 	},
	// 	mouseleave: function() {
	// 		$(this).animate({'scrollTop': 0}, 200);
	// 	}
	// });

	$('.category').on('click', function(event) {
		var category = '.' + this.className.split(' ')[1];
		$(this).data('clicked', !$(this).data('clicked')).toggleClass('active');

		if ($(this).data('clicked')) {
			set = set.add(category).not('.category');
			search.not(category).slideUp(200);
		}
		else {
			set = set.not(category);
			search.not(category).slideDown(200);
		}
	});

	$('.member_search').on('keyup change', function(event) {
		var value = $(this).val().toLowerCase();
		var elems = set.length > 0 ? set : $('.member');

		$.each(elems, function(index, elem) {
			var el_val = $(elem).text().toLowerCase();
			if (el_val.search(value) != -1) {
					$(elem).slideDown(200);
					search = search.add(elem);
			}
			else {
					$(elem).slideUp(200);
					search = search.not(elem)
			}
		});
	});
});