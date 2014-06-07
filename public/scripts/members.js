$(document).ready(function() {
	$('.member_search').keyup(function () {
		if ($(this).text().length == 0) {
			$(this).empty();
		}
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