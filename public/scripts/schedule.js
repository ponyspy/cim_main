$(document).ready(function() {
	var count = 0;

	function snakeForward () {
		count +=1;

		var elem = $('.snake');
		elem.first().clone().insertAfter(elem.last());

		var forms = $('.snake').eq(count).children('select');
		forms.each(function() {
			var value = $(this).attr('name');
			value = value.replace('0', count);
			$(this).attr('name', value);
		});
	}

	function snakeBack () {
		if ($('.snake').size() == 1) return null;
		$('.snake').last().remove();
	}

	$('.plus').on('click', snakeBack);
	$('.minus').on('click', snakeForward);
});