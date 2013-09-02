$(document).ready(function() {
	var min = 1, max = 3;
	var rand = min - 0.5 + Math.random()*(max-min+1)
	rand = Math.round(rand);

	// $('body').css('background-image','url(/images/' + rand + '.jpg)');

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