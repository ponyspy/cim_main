$(document).ready(function() {
	var min = 1, max = 9;
	var rand = min - 0.5 + Math.random()*(max-min+1)
	rand = Math.round(rand);

	$('body').css('background-image','url(/images/design/backgrounds/' + rand + '.jpg)');
});