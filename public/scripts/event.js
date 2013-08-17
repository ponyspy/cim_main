$(document).ready(function() {
	$('.calendar').mousemove(function(event) {
		var position = event.pageX;
		position = position - 550;
		if (position >= 178) position = 178;
		if (position <= 0) $('.date').css('margin-left', '-' + (position - position) + 'px');
		$('.date').css('margin-left', '-' + position + 'px');
	});
});