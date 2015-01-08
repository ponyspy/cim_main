$(document).ready(function() {
	$('.calendar').pickmeup({
		format: 'Y-m-d',
		flat: true,
		mode: 'single',
		calendars: '3',
		change: function(date_format) {
			$('.new_event').hide();
			$('.schedule_title').text('События на: ' + date_format);
			$('.events').empty();

			var date = date_format.split('-');
			date = new Date(+date[0], +date[1] - 1, +date[2]);

			$.post('/auth/schedule/get', {
				date: date.getTime()
			}).done(function(schedule) {
				schedule.forEach(function(item) {
					var event = $('<div/>', {'class':'event'}).addClass(item.event._id).addClass(date_format);
					var transfer = $('<button/>', {'class':'event_transfer', 'text': 'перенести'});
					var del = $('<button/>', {'class':'event_delete', 'text': 'удалить'});
					var banner = $('.new_event_banner').first().parent().clone(true, true).removeAttr('class');
					var premiere = $('.new_event_premiere').first().parent().clone(true, true).removeAttr('class');
					var hours = $('.new_event_hours').clone(true, true).attr('class', 'event_hours');
					var minutes = $('.new_event_minutes').clone(true, true).attr('class', 'event_minutes');
					var title = $('<span/>', {'class': 'event_title', 'text': item.event.ru.title});

					$('.events').append(event.append(del, transfer, banner, premiere, hours, minutes, title));
				});
			});


			// $('.event_transfer, .event_delete').remove();
			// $('.event').hide().filter('.' + date).each(function(index, el) {
			// 	var transfer = $('<button/>', {'class':'event_transfer', 'text': 'перенести'});
			// 	var del = $('<button/>', {'class':'event_delete', 'text': 'удалить'});
			// 	$(this).prepend(del, transfer);
			// }).show();
		},
		locale: {
			days: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'],
			daysShort: ['Вс.', 'Пн.', 'Вт.', 'Ср.', 'Чт.', 'Пт.', 'Сб.', 'Вс.'],
			daysMin: ['Вс.', 'Пн.', 'Вт.', 'Ср.', 'Чт.', 'Пт.', 'Сб.', 'Вс.'],
			months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
			monthsShort: ['Янв.', 'Фев.', 'Мар.', 'Апр.', 'Май', 'Июн.', 'Июл.', 'Авг.', 'Сен.', 'Окт.', 'Нояб.', 'Дек.']
		}
	});

	$('.event_add').click(function(event) {
		$('.new_event').show();
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
		}).done(function(id) {
			$('.new_event_premiere').prop('checked', false);
			$('.new_event_banner').prop('checked', false);
			$('.new_event_hours, .new_event_minutes, .new_event_id').find(':selected').prop('selected', false);
			$('.new_event').hide();

			var date_format = $('.calendar').pickmeup('get_date', 'd-m-Y');
			var event = $('<div/>', {'class':'event'}).addClass(id).addClass(date_format);
		});
	});
});