$(document).ready(function() {
	var eng = true;

	function toggleEnglish () {
		if (eng = !eng) {
			eng = true;
			$('.en').prop('disabled', eng).hide();
			$('.ru').css('float','none');
		}
		else {
			eng = false;
			$('.en').prop('disabled', eng).show();
			$('.ru').css('float','left');
		}
	}

	function snakeForward () {
		var elem = $(this).parent().find('select');
		elem.first().clone().insertAfter(elem.last())
	}

	function snakeBack () {
		if ($(this).parent().find('select').size() == 1) return null;
		$(this).parent().find('select :last').remove();
	}

	$('.back').on('click', snakeBack);
	$('.forward').on('click', snakeForward);
	$('.toggle_eng').on('click', toggleEnglish);
});