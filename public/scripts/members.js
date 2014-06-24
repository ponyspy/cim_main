$(document).ready(function() {
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
			$(this).animate({'scrollTop': 0}, 300);
		}
	});

	$('.category').click(function(event) {
		var category = '.' + $(this).attr('class').split(' ')[1];
		$('.member').not(category).slideUp(200);
	});

	$('.member_search').on('keyup change', function(event) {
			var value = $(this).val();

			var elems = $('.member');
			elems.each(function(index, el) {
					var el_val = $(el).html().toLowerCase();
					if (el_val.search(value.toLowerCase()) != -1) {
							$(el).slideDown(200);
					}
					else {
							$(el).slideUp(200);
					}
			});
	});
});