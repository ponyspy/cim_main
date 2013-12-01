var count = 0;
var scroll = 0;
var post_offset = 0;

function backScroller (event) {
	scroll += event.deltaY;
	var offset_top = $('.background_item').eq(count).offset().top;
	var offset_bottom = $('.background_item').eq(count).offset().top + $('.background_item').eq(count).height();
	$('.background_item').eq(count).css('margin-top', scroll);

	if (offset_bottom <= 0) {
		if (count != 1) {
			scroll = 0;
			count--;

			// post_offset += 3;
			// $.post('/photo_stream', {'offset':post_offset}).done(function(photos) {
			// 	if (photos != 'false') {
			// 		$.each(photos, function(index, photo) {
			// 			 var ph = $('<div />', {'class':'background_item', 'style': 'background-image: url(' + photo.image + ')'});
			// 			 $('.background_item:last').after(ph);
			// 		});
			// 	}
			// });

		}
	}
	else if (offset_top >= 0) {
		if (count != $('.background_item').length - 1) {
			scroll = - $('.background_item').eq(count).height();
			count++;
		}
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
		$('.background_block').on('scroll', backScroller);
	}
	else {
		$(this).on('mouseout', showStream);
		$(this).off('mousewheel');
		// $('.background_item').eq(count).offset({top:0});
		$('.background_item').eq(count).css('margin-top', '0');
		scroll = 0;
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