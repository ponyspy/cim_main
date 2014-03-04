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
		// $(forms).eq(5).removeAttr('value');
	}

	function snakeBack () {
		if ($('.snake').size() == 1) return null;
		$(this).parent('.snake').remove();
	}

	function ticketsList () {
		$(this).next('.tickets_list').toggle()
	}

	function checkForms () {
		var t_links = $('.t_link');

		t_links.each(function() {
			if ($(this).val() == '') {
				$(this).next('.t_partner').remove();
				$(this).remove();
			}
		});
	}

	$(document).on('submit','form', checkForms);
	$(document).on('click', '.minus', snakeBack);
	$('.plus').on('click', snakeForward);
	$(document).on('click', '.toggle_tickets', ticketsList);
});