$(document).ready(function() {

	$('.content_section_description, .content_section_ticket, .section_under').popline({disable:['color']});
	$('.section_content').sortable({connectWith: '.section_content', cancel: '.content_section_title, .content_section_description, .content_section_ticket, .add_content'});
	$('.sections_block').sortable({cancel:'.section_content *, .section_title, .section_under'});

	$('.submit').click(function(event) {
		var sections_upload = [];

		var sections = $('.section_block');

		sections.each(function(index, el) {
			var section_title = $(this).children('.section_title').text();
			var section_under = $(this).children('.section_under').html();
			var section_content = $(this).find('.content_section_block');

			var content = [];

			section_content.each(function(index, el) {
				var c_title = $(this).children('.content_section_title').text();
				var c_description = $(this).children('.content_section_description').html();
				var c_ticket = $(this).children('.content_section_ticket').html();

				content.push({
					title: c_title,
					description: c_description,
					ticket: c_ticket
				});

			});

			sections_upload.push({
				title: section_title,
				under: section_under,
				content: content
			});

		});

		$.post('', {sections: sections_upload}).done(function(data) {
			$('.submit').text('ГОТОВО!')
			setTimeout(function() {
				$('.submit').text('СОХРАНИТЬ');
			}, 500);
		});
	});


	function removeContent (event) {
		if (confirm('Удалить блок?')) {
			$(this).closest('.content_section_block').remove();
		}
	}

	function hideContent (event) {
		$(this).data('clicked', !$(this).data('clicked'));

		if ($(this).data('clicked')) {
			var title = $(this).closest('.content_section_block').find('.content_section_title').text();
			$(this).text(title);
			$(this).closest('.content_section_block').children(':not(.content_section_menu)').hide();
		}
		else {
			$(this).text('скрыть');
			$(this).closest('.content_section_block').children().show();
		}
	}

	function cleanContent (event) {
		var $this_block = $(this).closest('.content_section_block');
		var raw_description = $this_block.children('.content_section_description').html();
		var raw_ticket = $this_block.children('.content_section_ticket').html();

		raw_description = raw_description.replace(/(<[^>]*)style\s*=\s*('|")[^\2]*?\2([^>]*>)/g, '$1$3');
		raw_ticket = raw_ticket.replace(/(<[^>]*)style\s*=\s*('|")[^\2]*?\2([^>]*>)/g, '$1$3');

		$this_block.children('.content_section_description').empty().append(raw_description);
		$this_block.children('.content_section_ticket').empty().append(raw_ticket);
	}

	$('.hide_blocks').click(function() {
		var content = $('.content_section_block');

		content.each(function(index, el) {
			var title = $(this).find('.content_section_title').text();

			$(this).data('clicked', true);
			$(this).find('.content_hide').text(title);
			$(this).children(':not(.content_section_menu)').hide();
		});
	});

	function addContent (event) {
		var content_block = $('<div/>', {'class': 'content_section_block'});
		var content_title = $('<div/>', {'class':'content_section_title', 'contenteditable': true, 'text': 'Заголовок'});
		var content_description = $('<div/>', {'class':'content_section_description', 'contenteditable': true, 'text': 'Описание'});
		var content_ticket = $('<div/>', {'class':'content_section_ticket', 'contenteditable': true, 'text': 'Тикет'});

		var content_menu = $('<div/>', {'class': 'content_section_menu'});
		var content_hide = $('<div/>', {'class': 'content_hide', 'text': 'скрыть'});
		var content_remove = $('<div/>', {'class': 'content_remove', 'text': 'удалить'});
		var content_clean = $('<div/>', {'class': 'content_clean', 'text': 'очистить формат'});

		content_menu.append(content_hide, content_remove, content_clean);


		$(this).before(content_block.append(content_menu, content_title, content_description, content_ticket), function() {
			$('.sections_block, .section_content').sortable('refresh');
		});
		$('.content_section_description, .content_section_ticket, .section_under').popline({disable:['color']});
	}

	$('.add_section').click(function(event) {
		var section_block = $('<div/>', {'class': 'section_block'});
		var section_title = $('<div/>', {'class': 'section_title', 'contenteditable': true, 'text': 'ЗАГОЛОВОК СЕКЦИИ'});
		var section_content = $('<div/>', {'class': 'section_content'});
		var section_add_content = $('<div/>', {'class': 'add_content', 'text': 'ДОБАВИТЬ БЛОК'});
		var section_under = $('<div/>', {'class': 'section_under', 'text': 'Футер секции'});

		var section_menu = $('<div/>', {'class': 'section_menu_block'});
		var section_remove = $('<div/>', {'class': 'section_remove', 'text': 'удалить'});

		section_menu.append(section_remove);

		$('.sections_block').append(section_block.append(section_menu, section_title, section_content, section_add_content, section_under), function() {
			$('.sections_block, .section_content').sortable('refresh');
		});
	});

	function removeSection (event) {
		if (confirm('Удалить секцию?')) {
			$(this).closest('.section_block').remove();
		}
	}

	$(document).on('click', '.section_remove', removeSection);
	$(document).on('click', '.content_remove', removeContent);
	$(document).on('click', '.content_hide', hideContent);
	$(document).on('click', '.content_clean', cleanContent);
	$(document).on('click', '.add_content', addContent);

});