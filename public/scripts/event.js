$(document).ready(function() {
	var min = 1, max = 3;
	var rand = min - 0.5 + Math.random()*(max-min+1)
	rand = Math.round(rand);

	// $('body').css('background-image','url(/images/' + rand + '.jpg)');

	$('.calendar').mousemove(function(event) {
		var position = event.pageX;
		position = position - 550;
		if (position >= 178) position = 178;
		if (position <= 0) $('.date').css('margin-left', '-' + (position - position) + 'px');
		$('.date').css('margin-left', '-' + position + 'px');
	});
});