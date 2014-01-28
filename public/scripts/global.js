var counter = 0;
var post_counter = 0;

function hideDropMenu (event) {
	if (event.target.className != 'menu_item') {
	  $('.menu_item').children('.menu_drop').hide();
	  $('.menu_item').children('.menu_item_arrow').text('▼');
	  $('.menu_item').data('clicked', false);
	  $(document).off('click');
	}
}

function backScroller () {
	var offset_top = $('.background_item').eq(counter).offset().top;
	var offset_bottom = $('.background_item').eq(counter).offset().top + $('.background_item').eq(counter).height();

	if (offset_bottom <= 0) {
		counter++
		post_counter+=3
		var p_author = $('.background_item').eq(counter).children('.item_author').text();
		var p_description = $('.background_item').eq(counter).children('.item_description').text();

		$('.b_author').text(p_author);
		$('.b_description').text(p_description);

		$.post('/photo_stream', {'offset':post_counter}).done(function(photos) {
			if (photos != 'false') {
				$.each(photos, function(index, photo) {
					 var ph = $('<div />', {'class':'background_item', 'style': 'background-image: url(' + photo.image + ')'});
					 var ph_author = $('<div />', {'class':'item_author', 'text': photo.ru.author});
					 var ph_description = $('<div />', {'class':'item_description', 'text': photo.ru.description});
					 $('.background_item:last').after(ph.append(ph_author, ph_description));
				});
			}
		});
	}
	else if (offset_top >= 0 && counter != 0) {
		counter--
		var p_author = $('.background_item').eq(counter).children('.item_author').text();
		var p_description = $('.background_item').eq(counter).children('.item_description').text();

		$('.b_author').text(p_author);
		$('.b_description').text(p_description);
	}
}

function showStream () {
	$('.maket').fadeIn('fast');
	$('.background_description_block').stop(true, true).fadeOut('fast');
}

function hideStream () {
	$('.maket').fadeOut('fast');
	$('.background_description_block').stop(true, true).fadeIn('fast');
}

function fixStream () {
	$(this).data('clicked', !$(this).data('clicked'));

	if ($(this).data('clicked')) {
		$(this).off('mouseout mouseover');
		$(this).on('mouseover', showStream)
					 .on('mouseout', hideStream);
		$('.background_block').on('scroll', backScroller);
	}
	else {
		$(this).off('mouseover mouseout');
		$('.background_block').off('scroll');
		$(this).on('mouseover', hideStream)
					 .on('mouseout', showStream);
		$('.background_item').eq(counter).scrollintoview();
	}
}

$(document).ready(function() {

	$('.photo_stream').on('mouseover', hideStream)
										.on('mouseout', showStream)
										.on('click', fixStream);


	$('.pay').on('mouseover mouseout', function() {
		$('.pay_drop').toggle();
	});


	$('.menu_item').click(function(event) {
		$(this).data('clicked', !$(this).data('clicked'));

		if ($(this).data('clicked')) {
			$(this).children('.menu_item_arrow').text('▲');
			$(document).on('click', hideDropMenu);
		}
		else {
			$(this).children('.menu_item_arrow').text('▼');
			$(document).off('click');
		}
		$(this).children('.menu_drop').toggle();
	});
});