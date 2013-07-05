$(document).ready(function() {
	var eng = false;
	var event = false;

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
		$('.form_block_event').toggle();
		$('.form_block_event>input').prop('disabled', false);
	}

	function projectConstructor () {
		var count = $('.child').size();

		var child = $('<div />', {'class':'child'});
		var child_counter = $('<h2 />', {'class':'child_counter', 'text':'Событие ' + (count+1)});
		var form_head_title = $('<div />', {'class':'form_title', 'text':'Заголовок'});
		var form_head_s_title = $('<div />', {'class':'form_title', 'text':'Подзаголовок'});
		var form_head_body = $('<div />', {'class':'form_title', 'text':'Описание'});

		var title_ru = $('<input />', {'type':'text', 'class':'ru', 'name':'children[' + count + '][ru][title]'});
		var s_title_ru = $('<input />', {'type':'text', 'class':'ru', 'name':'children[' + count + '][ru][s_title]'});
		var body_ru = $('<textarea />', {'rows':'8', 'class':'ru', 'name':'children[' + count + '][ru][body]'});

		var title_en = $('<input />', {'type':'text', 'class':'en', 'name':'children[' + count + '][en][title]'});
		var s_title_en = $('<input />', {'type':'text', 'class':'en', 'name':'children[' + count + '][en][s_title]'});
		var body_en = $('<textarea />', {'rows':'8', 'class':'en', 'name':'children[' + count + '][en][body]'});

		$('.children').append(child.append(child_counter, form_head_title, title_ru, title_en, 
																			 form_head_s_title, s_title_ru, s_title_en, form_head_body, body_ru, body_en));
	}

	function StickyTags() { 
		var offset = 0;
		var sticky = false;
		var top = $(window).scrollTop();
		
		if ($(".form_block").offset().top < top) {
			$(".navigator").css('position', 'fixed').css('top', '15px');
			sticky = true;
		} else {
			$(".navigator").css('position', 'relative').css('top', '120px');
		}
	};

	$(window).on('scroll', StickyTags);
	$('.add_child').on('click', projectConstructor);
	$('.toggle_eng').on('click', toggleEnglish);
	$('.event_convert').on('click', toggleEvent);

	$('.form_submit').click(function() {
		$('form').submit();
	});
});