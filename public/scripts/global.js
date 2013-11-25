var count = 0;
var scroll = 0;

function backScroller (event) {
	scroll += event.originalEvent.wheelDelta;
	$('.background_item').eq(count).css('margin-top', scroll);


	if ($('.background_item').eq(count).offset().top + $('.background_item').eq(count).height() <= 0) {
		scroll = 0;
		if (count != 0)
			count--;
		else
			count = 0;
	}
	else if ($('.background_item').eq(count).offset().top >= 0) {
		count++;
		scroll = - $('.background_item').eq(count).height();
	}


	// if (event.originalEvent.wheelDelta < 0) {
	// 	//scroll down
	// 	if ($('.background_item').eq(count).offset().top + $('.background_item').eq(count).height() <= 0) {
	// 		scroll = 0;
	// 		count--;
	// 	}
	// }
	// else {
	// 	//scroll up
	// 	if ($('.background_item').eq(count).offset().top >= 0) {
	// 		count++;
	// 		scroll = - $('.background_item').eq(count).height()
	// 	}
	// }
}

function showStream () {
	$('.maket').fadeIn('fast');
}

function hideStream () {
	$('.maket').fadeOut('fast');
}

function fixStream () {
	$(this).data('clicked', !$(this).data('clicked'));

	if ($(this).data('clicked')) {
		$(this).off('mouseout');
		$('.background_block').on('mousewheel', backScroller);
	}
	else {
		$(this).on('mouseout', showStream);
		$(this).off('mousewheel');
	}
}

$(document).ready(function() {
	count = $('.background_item').length - 1;

	$('.photo_stream').on('mouseover', hideStream);
	$('.photo_stream').on('mouseout', showStream);
	$('.photo_stream').on('click', fixStream);

	$('.pay').on({
		mouseover: function() {
			$('.pay_drop').show();
		},
		mouseout: function() {
			$('.pay_drop').hide();
		}
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