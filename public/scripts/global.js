$(document).ready(function() {
	var menu = $('.menu_item');

	// $(document).click(function(event) {
	// 	t = event.target || event.srcElement;
	// 	// alert(t.className)
	// 	if (t.className != 'menu_item' ) {
	// 		$('.menu_item_arrow').text('▼');
	// 		$('.menu_drop').hide();
	// 	};
	// });

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