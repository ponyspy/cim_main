$(document).ready(function() {
	var images = ['pink_love.jpg', 'angry.jpg', 'godzilla.png', 'ashtar.jpg', 'chen.jpg', 'su.gif', 'pos.jpg', 'gogol.jpg', 'mazo.jpg'];
	var min = 0, max = images.length - 1;
	var rand = min - 0.5 + Math.random()*(max-min+1)
	rand = Math.round(rand);

	$('body').css('background-image','url(/images/design/backgrounds/lol/' + images[rand] +')');
});