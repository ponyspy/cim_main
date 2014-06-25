$(document).ready(function() {
	var set = $();

	$('.member').on({
		mouseover: function() {
			var cat = [];
			var categorys = $(this).attr('class').split(' ');
			$.each(categorys, function(index, category) {
				cat.push('.' + category)
			});
			$('.categorys').children(cat.join(',')).css({'background-color': 'white', 'color': 'black'});
		},
		mouseout: function() {
			$('.categorys').children().removeAttr('style');
		}
	});

	$('.members_column').on({
		mousemove: function(event) {
			$(this).scrollTop(event.pageY - 330);
		},
		mouseleave: function() {
			$(this).animate({'scrollTop': 0}, 200);
		}
	});

	$('.category').on('click', function(event) {
		var category = '.' + $(this).attr('class').split(' ')[1];
		$(this).data('clicked', !$(this).data('clicked')).toggleClass('active');

		if ($(this).data('clicked')) {
			set = set.add(category).not('.category');
			$('.member').not(category).slideUp(200);
		}
		else {
			set = set.not(category);
			$('.member').not(category).slideDown(200);
		}
	});

	$('.member_search').on('keyup change', function(event) {
		var value = $(this).val().toLowerCase();
		var elems = set.length > 0 ? set : $('.member');

		elems.each(function(index, el) {
			var el_val = $(el).text().toLowerCase();
			if (el_val.search(value) != -1) {
					$(el).slideDown(200);
			}
			else {
					$(el).slideUp(200);
			}
		});
	});
});