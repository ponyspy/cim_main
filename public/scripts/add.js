$(document).ready(function() {
	var count = $('.child').size();
	var eng = true;
	var event = false;
	var project = false;

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

	function toggleEvent () {
		if (event = !event) {
			$('.nav_title').text('СОБЫТИЕ');
			$('.form_block_event').toggle();
			$('.form_block_event>input.ru').prop('disabled', false);
			$('.form_block_event>select').prop('disabled', false);
		}
		else {
			$('.nav_title').text('НОВОСТЬ');
			$('.form_block_event').toggle();
			$('.form_block_event>input').prop('disabled', true);
			$('.form_block_event>select').prop('disabled', true);		
		}
	}

	function toggleProject () {
		if (project = !project) {
			$('.nav_title').text('СПЕЦПРОЕКТ');
			if (count == 0) projectConstructor();
			$('.form_block_project').toggle();
			$('.form_block_event>select').prop('disabled', true);
		}
		else {
			$('.nav_title').text('СОБЫТИЕ');
			$('.form_block_project').toggle();
			$('.form_block_event>select').prop('disabled', false);
			count = $('.child').size();
		}
	}

	function projectConstructor () {
		count = $('.child').size();

		var child = $('<div />', {'class':'child'});
		var child_counter = $('<h2 />', {'class':'child_counter', 'text':'Событие ' + (count+1)});
		var form_head_title = $('<div />', {'class':'form_title', 'text':'Заголовок'});
		var form_head_s_title = $('<div />', {'class':'form_title', 'text':'Подзаголовок'});
		var form_head_body = $('<div />', {'class':'form_title', 'text':'Описание'});

		var title_ru = $('<input />', {'type':'text', 'class':'ru', 'name':'children[' + count + '][ru][title]'});
		var s_title_ru = $('<input />', {'type':'text', 'class':'ru', 'name':'children[' + count + '][ru][s_title]'});
		var body_ru = $('<textarea />', {'rows':'8', 'class':'ru', 'name':'children[' + count + '][ru][body]'});

		var title_en = $('<input />', {'type':'text', 'class':'en', 'disabled':'disabled', 'name':'children[' + count + '][en][title]'});
		var s_title_en = $('<input />', {'type':'text', 'class':'en', 'disabled':'disabled', 'name':'children[' + count + '][en][s_title]'});
		var body_en = $('<textarea />', {'rows':'8', 'class':'en', 'disabled':'disabled', 'name':'children[' + count + '][en][body]'});

		$('.children').append(child.append(child_counter, form_head_title, title_ru, title_en, 
																			 form_head_s_title, s_title_ru, s_title_en, form_head_body, body_ru, body_en));
	}

	function StickyTags() { 
		var offset = 0;
		var sticky = false;
		var top = $(window).scrollTop();
		
		if ($(".form_block").offset().top < top) {
			$(".navigator").css('position', 'fixed').css('margin-left', '950px').css('top', '0px');
			sticky = true;
		} else {
			$(".navigator").css('position', 'relative').css('margin-left', '0px');
		}
	};

	$(window).on('scroll', StickyTags);
	$('.add_child').on('click', projectConstructor);
	$('.toggle_eng').on('click', toggleEnglish);
	$('.event_convert').on('click', toggleEvent);
	$('.project_convert').on('click', toggleProject);

	$('.form_submit').click(function() {
		$('form').submit();
	});
});