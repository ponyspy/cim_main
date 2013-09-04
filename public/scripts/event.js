$(document).ready(function() {

	if ($('.date').size() >= 8) {
		$('.calendar').mousemove(function(event) {
			var duration = event.pageX;
			var size = $('.date').size() * 110 / 2 - 70

			duration = duration - 400;
			if (duration >= size) duration = size;
			if (duration <= 0) $('.inner').css('margin-left', '-' + (duration - duration) + 'px')
			$('.inner').css('margin-left', '-' + duration + 'px')
			$('.stat').text(size)
		});
	}

});