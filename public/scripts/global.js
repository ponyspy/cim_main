$(document).ready(function() {

	$('.pay').hover(function() {
		$('.pay_drop').show()
	}, function() {
		$('.pay_drop').hide()
	});

	var menu = $('.menu_item');

	menu.each(function() {
		var flip = false;

		$(this).click(function(event) {
			t = event.target || event.srcElement;

			if (t.className == 'menu_item' || t.className == 'menu_item_arrow' || t.className == 'menu_item_title') {
				if (flip = !flip) {
					$(this).children('.menu_item_arrow').text('▲');
					flip = true;
				}
				else {
					$(this).children('.menu_item_arrow').text('▼');
					flip = false;
				}
				$(this).children('.menu_drop').toggle();
			}
		});
	});
});