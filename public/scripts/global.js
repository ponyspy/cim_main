var counter = 0;

function backScroller () {
	var offset_top = $('.background_item').eq(counter).offset().top;
	var offset_bottom = $('.background_item').eq(counter).offset().top + $('.background_item').eq(counter).height();

	if (offset_bottom <= 0) {
		counter++
		var p_author = $('.background_item').eq(counter).children('.item_author').text();
		var p_description = $('.background_item').eq(counter).children('.item_description').text();

		$('.b_author').text(p_author);
		$('.b_description').text(p_description);

		$.post('/photo_stream', {'offset':counter+2}).done(function(photos) {
			if (photos != 'false') {
				$.each(photos, function(index, photo) {
					 var ph = $('<div />', {'class':'background_item', 'style': 'background-image: url(' + photo.image + ')'});
					 $('.background_item:last').after(ph);
				});
			}
		});
	}
}

function showStream () {
	$('.maket').fadeIn('fast');
	$('.background_description_block').hide();
}

function hideStream () {
	$('.maket').fadeOut('fast');
	$('.background_description_block').show();
}

function fixStream () {
	$(this).data('clicked', !$(this).data('clicked'));

	if ($(this).data('clicked')) {
		$(this).off('mouseout');
		$('.background_block').on('scroll', backScroller);
	}
	else {
		$(this).on('mouseout', showStream);
		$(this).off('scroll');
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