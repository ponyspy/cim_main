$(document).ready(function() {
	function clearFields () {
		$('.new_event_premiere, .new_event_banner').prop('checked', false);
		$('.new_event_hours, .new_event_minutes, .new_event_id').find(':selected').prop('selected', false);
		$('.new_event').hide();
		$('.event_add').show();
	}

	function scheduleItem (item) {
		var item_date = new Date(item.date);

		var event = $('<div/>', {'class':'event'}).addClass(item._id);
		var check = $('<input/>', {'class':'event_check', 'type': 'checkbox'});

		var banner = $('.new_event_banner').first().parent().clone(true, true);
		banner.children('input').attr('class', 'event_banner').prop('checked', item.meta.banner);

		var premiere = $('.new_event_premiere').first().parent().clone(true, true);
		premiere.children('input').attr('class', 'event_premiere').prop('checked', item.meta.premiere);

		var hours = $('.new_event_hours').clone(true, true).attr('class', 'event_hours');
		hours.children('option').filter('[value="'+ item_date.getHours() +'"]').prop('selected', true);

		var minutes = $('.new_event_minutes').clone(true, true).attr('class', 'event_minutes');
		minutes.children('option').filter('[value="'+ item_date.getMinutes() +'"]').prop('selected', true);

		var title = $('<span/>', {'class': 'event_title', 'text': item.event.ru.title});

		$('.events').append(event.append(check, hours, minutes, banner, premiere, title));
	}


	$('.calendar').pickmeup({
		format: 'Y-m-d',
		flat: true,
		mode: 'single',
		calendars: '3',
		change: function(date_format) {
			clearFields();
			$('.schedule_title').text('События на: ' + date_format);
			$('.events').empty();
			$('.event_options').hide();

			var date = date_format.split('-');
			date = new Date(+date[0], +date[1] - 1, +date[2]);

			$.post('/auth/schedule/get', {
				date: date.getTime()
			}).done(function(schedule) {
				schedule.forEach(scheduleItem);
			});
		},
		locale: {
			days: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'],
			daysShort: ['Вс.', 'Пн.', 'Вт.', 'Ср.', 'Чт.', 'Пт.', 'Сб.', 'Вс.'],
			daysMin: ['Вс.', 'Пн.', 'Вт.', 'Ср.', 'Чт.', 'Пт.', 'Сб.', 'Вс.'],
			months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
			monthsShort: ['Янв.', 'Фев.', 'Мар.', 'Апр.', 'Май', 'Июн.', 'Июл.', 'Авг.', 'Сен.', 'Окт.', 'Нояб.', 'Дек.']
		}
	});

	$(document).on('change', '.event_check', function(event) {
			$('.event_check:checked').length > 0
				? $('.event_options').show()
				: $('.event_options').hide();
	});

	$('.event_del').click(function(event) {
		var items = [];
		var checked_items = $('.event_check:checked').parent('.event');

		checked_items.each(function(index, elem) {
			var item = $(this).attr('class').split(' ')[1];
			items.push(item);
		});

		$.post('/auth/schedule/remove', {
			items: items
		}).done(function(items) {
			checked_items.remove();
			$('.event_options').hide();
		});
	});

	$('.event_add').click(function(event) {
		$('.new_event').show();
		$(this).hide();
	});

	$('.event_add_cancel').click(function(event) {
		$('.new_event').hide();
		$('.event_add').show();
	});

	$('.event_add_submit').click(function(event) {
		var hours = $('.new_event_hours').find(':selected').val();
		var minutes = $('.new_event_minutes').find(':selected').val();
		var date = $('.calendar').pickmeup('get_date');
		date.setHours(hours, minutes, 0);
		var event = $('.new_event_id').find(':selected').val();
		var premiere = $('.new_event_premiere').is(':checked');
		var banner = $('.new_event_banner').is(':checked');


		$.post('/auth/schedule/add', {
			date: date.getTime(),
			event: event,
			meta: {
				premiere: premiere,
				banner: banner
			}
		}).done(function(item) {
			clearFields();
			scheduleItem(item);
		});
	});
});