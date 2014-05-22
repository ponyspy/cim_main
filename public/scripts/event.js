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

	var img_count = $('.image_upload').length - 1;

	$('.photos_block').zlayer([
	    {
	        layer:'.image_upload:odd',
	        mass: 1,
	        confine:'y'
	    },
	    {
	        layer:'.image_upload:even',
	        mass: 5,
	        confine:'y'
	    },
	], {
	 repositionTransition:'all 0.5s'
	});

	// $('.video_spin').click(function(event) {
	// 	$('.photos_inner').animate({
	// 		'margin-left': '+=930px'
	// 	}, 500);
	// });

	// $('.photos_spin, .image_upload').click(function(event) {
	// 	$('.photos_inner').animate({
	// 		'margin-left': '-=1395px'
	// 	}, 500);
	// });

	$('.image_upload:odd').click(function(event) {
		$('.photos_inner').animate({
			'margin-left': '-=1860px'
		}, 500);
	});

	$('.image_upload:even').click(function(event) {
		$('.photos_inner').animate({
			'margin-left': '+=1860px'
		}, 500);
	});
});