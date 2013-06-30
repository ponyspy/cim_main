$(document).ready(function() {
	var menu = $('.menu_item');
	var drop = $('<div/>', {'class':'menu_drop'});

	menu.each(function(index) {
		$(this).click(function() {
			$(this).append(drop);			
		});
	});
});