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

		var title_str = item.event.ru.title.length <= 45 ? item.event.ru.title : item.event.ru.title.slice(0, 45) + '...'
		var title = $('<span/>', {'class': 'event_title', 'text': title_str});

		$('.events').append(event.append(check, hours, minutes, banner, premiere, title));
	}


	$('.calendar').pickmeup({
		format: 'Y-m-d',
		flat: true,
		mode: 'single',
		calendars: '3',
		fill: function() {
			var date_format = $('.calendar').pickmeup('get_date', 'Y-m-d');
			var date = $('.calendar').pickmeup('get_date', false);

			$('.schedule_title').text('События на: ' + date_format);
			$('.events').empty();
			$('.event_options').hide();

			clearFields();

			$.post('/auth/schedule/get', {
				date: date.getTime()
			}).done(function(schedule) {
				!!schedule
					? schedule.forEach(scheduleItem)
					: $('.connect_banner').show();
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

	$('.connect_reload').click(function(event) {
		location.reload(true);
	});

	$('.schedule_now').click(function(event) {
		var now = new Date();
		$('.calendar').pickmeup('set_date', now);
	});

	$(document).on('change', '.event_check', function(event) {
		if ($('.event_check:checked').length > 0) {
			$('.event_options').show();
			$('.new_event').hide();
			$('.event_add').hide();
		}
		else {
			$('.event_options').hide();
			$('.event_add').show();
		}
	});

	$(document).on('change', '.event_hours, .event_minutes, .event_premiere, .event_banner', function(event) {
		$('.event_add').hide();
		$('.event_options').show();
		$(this).closest('.event').children('.event_check').prop('checked', true);
	});

	$('.event_edit').click(function(event) {
		if (!confirm('Редактировать выбарннные элементы?')) return false;

		var items = [];
		var $checked_items = $('.event_check:checked').parent('.event');

		$checked_items.each(function() {
			items.push({
				id: $(this).attr('class').split(' ')[1],
				hours: $(this).children('.event_hours').val(),
				minutes: $(this).children('.event_minutes').val(),
				meta: {
					banner: $(this).find('.event_banner').is(':checked'),
					premiere: $(this).find('.event_premiere').is(':checked')
				}
			});
		});

		$.post('/auth/schedule/edit', {items: items}).done(function(items) {
			$('.event_check:checked').prop('checked', false);
			$('.event_options').hide();
			$('.event_add').show();
		});
	});

	$('.event_del').click(function(event) {
		if (!confirm('Удалить?')) return false;

		var items = [];
		var $checked_items = $('.event_check:checked').parent('.event');

		$checked_items.each(function(index, elem) {
			var item = $(this).attr('class').split(' ')[1];
			items.push(item);
		});

		$.post('/auth/schedule/remove', {
			items: items
		}).done(function(items) {
			$checked_items.remove();
			$('.event_options').hide();
			$('.event_add').show();
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