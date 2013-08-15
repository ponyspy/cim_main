$(document).ready(function() {
	$('.calendar').mousemove(function(event) {
		var duration = event.pageX;
		duration = duration - duration/2 - 200
		$('.date').css('margin-left', '-' + duration + 'px')
		$('.stat').text(duration)
	});
});