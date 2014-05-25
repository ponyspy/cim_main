$(document).ready(function() {

	$('.cal_month_block').not(':has(.cal_item)').prev('.cal_inner_title').hide();

	if ($('.cal_date').size() > 3) {
		$('.calendar').mousemove(function(event) {
			var duration = event.pageX;
			var size = $('.cal_date').size() * 200 / 2 - 70

			duration = duration - 400;
			if (duration >= size) duration = size;
			if (duration <= 0) $('.inner').css('margin-left', '-' + (duration - duration) + 'px')
			$('.inner').css('margin-left', '-' + duration + 'px')
			$('.stat').text(size)
		});
	}
	else {
		$('.calendar').mouseenter(function(event) {
			$('.inner').animate({'margin-left': '0px'}, 200);
		});
	}

	$('.calendar').mouseleave(function(event) {
		$('.inner').animate({'margin-left': '-29px'}, 200);
	});


	var count_photos = $('.image_upload').length;
	var count_trailers = $('.trailer').length;

	$('.photos_inner').css({
		'width': (count_photos + count_trailers) * 930 + 'px',
		'margin-left': '-' + (count_trailers * 930) + 'px'
	});


	var parallax = [
		{
			layer:'.image_upload:odd',
			mass: 2,
			confine:'y'
		},
		{
			layer:'.image_upload:even',
			mass: 5,    // 5 || 4.5
			confine:'y'
		},
	]

	var parallax_inverse = [
		{
			layer:'.image_upload:odd',
			mass: 2,
			confine:'y'
		},
		{
			layer:'.image_upload:even',
			mass: 1,     // 1 || 0.5
			confine:'y'
		},
	]


	var reposition = {
		repositionTransition:'all 0.5s'
	}

	var mode = true;

	$('.photos_block').zlayer(parallax, reposition);

	$('.switch').click(function(event) {
		$(this).data('clicked', !$(this).data('clicked'));

		if ($(this).data('clicked')) {
			$(this).text('ФОТО');
			$('.switch').animate({
				'margin-left': '+=850px'
			}, 500);

			$('.photos_inner').animate({
				'margin-left': '+=930px'
			}, 500);
		}
		else {
			$(this).text('ВИДЕО');
			$('.switch').animate({
				'margin-left': '0px'
			}, 500);

			$('.photos_inner').animate({
				'margin-left': '-=930px'
			}, 500);
		}
	});


	// $('.title').click(function(event) {
	// 	var $element = $('.photos_block');
	// 	$element.zlayer = null;
	// 	$element.off();
	// });

	// $('.ticket').click(function(event) {
	// 	$('.photos_block').zlayer(parallax, reposition);
	// });



	function slide (event) {
		$('.switch').hide();
		$('.image_upload').css({'-webkit-transform': 'translate3d(0, 0, 0)', '-webkit-transition-duration': '0.5s'});

		if (mode) {
			mode = !mode;
			$('.photos_block').zlayer(parallax_inverse, reposition);
			// $('.image_upload:even').css({'-webkit-transform': 'translate3d(-430px, 0, 0)', '-webkit-transition-duration': '0.2s'});
		}
		else {
			mode = !mode;
			$('.photos_block').zlayer(parallax, reposition);
			// $('.image_upload:even').css({'-webkit-transform': 'translate3d(100px, 0, 0)', '-webkit-transition-duration': '0.2s'});
		}

		$('.photos_inner').animate({
			'margin-left': event.data.offset
		}, 500, function() {
			$('.switch').show();
		});
	}

	// $('.image_upload:odd').on('click', {offset:'-=930px'}, slide);
	// $('.image_upload:even').on('click', {offset:'+=930px'}, slide);

	// $(document).on('click', '.image_upload:odd', {offset:'-=930px'}, slide);
	// $(document).on('click', '.image_upload:even', {offset:'+=930px'}, slide);

});