$(document).ready(function() {
	var set = $();
	var search = $('.member');

	$('.maket').on('scroll', function(event) {
		var scrollTop = $(this).scrollTop();

		if (scrollTop >= 143)
			$('.members_search_block').addClass('fixed');
		else
			$('.members_search_block').removeClass('fixed');
	});

	$('.member_search_title').click(function(event) {
		$('.member_search').focus();
	});

	$('.all').click(function(event) {
		$(this).remove();
		$('.category.hide').toggleClass('hide');
	});

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

	$('.category').on('click', function(event) {
		var category = '.' + this.className.split(' ')[1];
		$(this).data('clicked', !$(this).data('clicked')).toggleClass('active');

		if ($(this).data('clicked')) {
			set = set.add(category).not('.category');
			search.not(category).hide();
		}
		else {
			set = set.not(category);
			search.not(category).show();
		}
	});

	$('.member_search').on('keyup change', function(event) {
		var value = $(this).val().toLowerCase();
		var elems = set.length > 0 ? set : $('.member');

		$.each(elems, function(index, elem) {
			var el_val = $(elem).text().toLowerCase();
			if (el_val.search(value) != -1) {
					$(elem).show();
					search = search.add(elem);
			}
			else {
					$(elem).hide();
					search = search.not(elem)
			}
		});
	});
});