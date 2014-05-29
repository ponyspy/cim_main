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

			$('.photos_block').animate({
				'scrollLeft': 0
			}, 500);
		}
		else {
			$(this).text('ВИДЕО');
			$('.switch').animate({
				'margin-left': '0px'
			}, 500);

			$('.photos_block').animate({
				'scrollLeft': 930
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

	trailer_length = $('.trailer').length;
	$('.photos_block').scrollLeft(trailer_length * 930)

	function slide (event) {
		$('.switch').hide();
		$('.image_upload').css({'-webkit-transform': 'translate3d(0, 0, 0)', '-webkit-transition-duration': '0.5s'});

		if (mode) {
			mode = !mode;
			$('.photos_block').zlayer(parallax_inverse, reposition);
		}
		else {
			mode = !mode;
			$('.photos_block').zlayer(parallax, reposition);
		}

		var index = $(this).index();
		$('.photos_block').animate({
		    'scrollLeft': (index * 930) + (trailer_length * 930)
		}, 500, function() {
			$('.switch').show();
		});
	}

	$(document).on('click', '.image_upload', slide);

});