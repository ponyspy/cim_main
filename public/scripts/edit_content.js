$(document).ready(function() {

	$('.content_section_description, .content_section_ticket, .section_under').popline({disable:['color']});
	$('.section_content').sortable({connectWith: '.section_content', cancel: '.content_section_title, .content_section_description, .content_section_ticket, .add_content'});
	$('.sections_block').sortable({cancel:'.section_content *, .section_title, .section_under'});

	$('.submit').click(function(event) {
		var sections_upload = [];

		var sections = $('.section_block');

		sections.each(function(index, el) {
			var section_title = $(this).children('.section_title').html();
			var section_under = $(this).children('.section_under').html();
			var section_content = $(this).find('.content_section_block');

			var content = [];

			section_content.each(function(index, el) {
				var c_title = $(this).children('.content_section_title').html();
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
			console.log(data);
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

	function addContent (event) {
		var content_block = $('<div/>', {'class': 'content_section_block'});
		var content_title = $('<div/>', {'class':'content_section_title', 'contenteditable': true, 'text': 'Заголовок'});
		var content_description = $('<div/>', {'class':'content_section_description', 'contenteditable': true, 'text': 'Описание'});
		var content_ticket = $('<div/>', {'class':'content_section_ticket', 'contenteditable': true, 'text': 'Тикет'});

		var content_menu = $('<div/>', {'class': 'content_section_menu'});
		var menu_hide = $('<div/>', {'class': 'menu_hide', 'text': 'скрыть'});
		var menu_remove = $('<div/>', {'class': 'menu_remove', 'text': 'удалить'});

		content_menu.append(menu_hide, menu_remove);


		$(this).before(content_block.append(content_menu, content_title, content_description, content_ticket));
		$('.content_section_description, .content_section_ticket, .section_under').popline({disable:['color']});
	}

	$('.add_section').click(function(event) {
		var section_block = $('<div/>', {'class': 'section_block'});
		var section_title = $('<div/>', {'class': 'section_title', 'contenteditable': true, 'text': 'ЗАГОЛОВОК СЕКЦИИ'});
		var section_content = $('<div/>', {'class': 'section_content'});
		var section_add_content = $('<div/>', {'class': 'add_content', 'text': 'ДОБАВИТЬ БЛОК'});
		var section_under = $('<div/>', {'class': 'section_under', 'text': 'Футер секции'});

		$('.sections_block').append(section_block.append(section_title, section_content, section_add_content, section_under));
		$('.section_content').sortable('refresh');
	});

	$(document).on('click', '.menu_remove', removeContent);
	$(document).on('click', '.menu_hide', hideContent);
	$(document).on('click', '.add_content', addContent);

});