$(document).ready(function() {

	function snakeForward () {
		var elem = $('.snake');
		elem.first().clone().insertAfter(elem.last());

		var forms = $('.snake').eq(elem.length).children('select, input').filter(':not(.minus)');
		forms.each(function() {
			var value = $(this).attr('name');
			value = value.replace('0', elem.length);
			$(this).attr('name', value);
			$(this).filter(':checked').prop('checked', false);
			$(this).children('option').eq(0).attr('selected', true);
		});
		$(forms).eq(7).removeAttr('value');
	}

	function snakeBack () {
		if ($('.snake').size() == 1) return null;
		$(this).parent('.snake').remove();
	}

	$(document).on('click', '.minus', snakeBack);
	$('.plus').on('click', snakeForward);
});