$(document).ready(function() {
	var menu = $('.menu_item');
	var drop = $('<div/>', {'class':'menu_drop'});

	$('document').click(function() {
		$('.menu_drop').hide();
	});

	menu.each(function(index) {
		$(this).click(function() {
			$(this).children('.menu_item_arrow').text('▲')
			$(this).children('.menu_drop').toggle();
		});
	});
});