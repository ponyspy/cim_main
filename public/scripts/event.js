$(document).ready(function() {

	if ($('.cal_date').size() >= 3) {
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

	$('.cal_date').on({
		mouseover: function() {
			$(this).next('.cal_schedule').stop().animate({'margin-left':'0px'}, 200)
		},
		mouseout: function() {
			$(this).next('.cal_schedule').stop().animate({'margin-left':'-120px'}, 200)
		},
	})

});