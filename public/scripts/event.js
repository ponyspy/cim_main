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


	trailer_length = $('.trailer').length;
	$('.photos_block').scrollLeft(trailer_length * 930);
	$('.photos_block').zlayer(parallax, reposition);


	// $('.title').click(function(event) {
	// 	var $element = $('.photos_block');
	// 	$element.zlayer = null;
	// 	$element.off();
	// });


	var mode = true;
	var old_index = 0;

	function getSlide (event) {
		$('.switch').hide();
		$('.image_upload').css({'-webkit-transform': 'translate3d(0, 0, 0)', '-webkit-transition-duration': '0.5s'});
		var index = $(this).index();

		if (index != old_index) {
			if (mode) {
				mode = !mode;
				$('.photos_block').zlayer(parallax_inverse, reposition);
			}
			else {
				mode = !mode;
				$('.photos_block').zlayer(parallax, reposition);
			}
			old_index = index;
		}

		$('.photos_block').animate({
		    'scrollLeft': (index * 930) + (trailer_length * 930)
		}, 500, function() {
			$('.switch').show();
		});
	}

	function getSwitch () {
		$(this).data('clicked', !$(this).data('clicked'));

		var sw = $(this).data('clicked');
		var sw_text = sw ? 'ФОТО' : 'ВИДЕО';
		var sw_margin = sw ? '850px' : '0px';
		var sw_scroll = sw ? 0 : 930;

		$(this).text(sw_text);
		$('.switch').animate({
			'margin-left': sw_margin
		}, 500);

		$('.photos_block').animate({
			'scrollLeft': sw_scroll
		}, 500);
	}

	$(document).on('click', '.image_upload', getSlide);
	$('.switch').on('click', getSwitch)
});