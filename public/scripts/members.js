$(document).ready(function() {
	$('.member').mouseover(function(event) {
		var id = $(this).attr('class').split(' ')[1];
		$('.' + id).css('color', 'red');
	});

	$('.member').on({
		mouseover: function() {
			var id = $(this).attr('class').split(' ')[1];
			$('.' + id).css({'background-color': 'white', 'color': 'black'});
		},
		mouseout: function() {
			var id = $(this).attr('class').split(' ')[1];
			$('.' + id).removeAttr('style');
		}
	})

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