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
				mass: 5,
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
				mass: 1,
				confine:'y'
			},
	]

var reposition = {
	 repositionTransition:'all 0.5s'
	}

	var mode = true;

	$('.photos_block').zlayer(parallax, reposition);

	$('.switch').click(function(event) {
		$('.photos_inner').animate({
			'margin-left': '+=930px'
		}, 500);
	});

	$('.image_upload:odd').click(function(event) {
		if (mode) {
			mode = !mode;
			$('.photos_block').zlayer(parallax_inverse, reposition);
		}
		else {
			mode = !mode;
			$('.photos_block').zlayer(parallax, reposition);
		}

		$('.photos_inner').animate({
			'margin-left': '-=930px'
		}, 500);
	});

	$('.image_upload:even').click(function(event) {
		if (mode) {
			mode = !mode;
			$('.photos_block').zlayer(parallax_inverse, reposition);
		}
		else {
			mode = !mode;
			$('.photos_block').zlayer(parallax, reposition);
		}

		$('.photos_inner').animate({
			'margin-left': '+=930px'
		}, 500);
	});
});