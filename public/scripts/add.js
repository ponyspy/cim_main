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
			$('.form_block_event>input').prop('disabled', false);
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

		function title (text) {
			var title = $('<div />', {'class':'form_title', 'text':text});
			return title;
		}

		function form (lang, name) {
			if (name == 'en')
				var form = $('<input />', {'type':'text', 'class':lang, 'name':'children[' + count + '][' + lang + '][' + name + ']'});
			else
				var form = $('<input />', {'type':'text', 'class':lang, 'name':'children[' + count + '][' + lang + '][' + name + ']'});
			return form;
		}

		function date (name) {
			var select = $('<select />', {'name':'children[' + count + '][cal][' + name + ']'});
			if (name == 'date') {
				var o_title = $('<option />', {'value':'', 'text':'Дата'});
				select.append(o_title);
				for (var i=1; i < 32; i++) {
					var option = $('<option />', {'value':i, 'text':i});
					select.append(option)
				}
			}
			else if (name == 'month') {
				var o_title = $('<option />', {'value':'', 'text':'Месяц'});
				select.append(o_title);
				var months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
				for (var i in months) {
					var option = $('<option />', {'value':i, 'text':months[i]});
					select.append(option)
				}
			}
			else if (name == 'year') {
				var o_title = $('<option />', {'value':'', 'text':'Год'});
				select.append(o_title);				
				var date = new Date();
				var now = $('<option />', {'value':date.getFullYear(), 'text':date.getFullYear()});
				var next = $('<option />', {'value':date.getFullYear()+1, 'text':date.getFullYear()+1});
				select.append(now, next)
			}
			else return null;

			return select;
		}



		var child = $('<div />', {'class':'child'});
		var child_counter = $('<h2 />', {'class':'child_counter', 'text':'Событие ' + (count+1)});
		
		var body_ru = $('<textarea />', {'rows':'8', 'class':'ru', 'name':'children[' + count + '][ru][body]'});
		var body_en = $('<textarea />', {'rows':'8', 'class':'en', 'name':'children[' + count + '][en][body]'});

		$('.children').append(child.append(child_counter, title('Заголовок'), form('ru','title'), form('en','title'), 
																			 								title('Подзаголовок'), form('ru','s_title'), form('en','s_title'), 
																			 								title('Описание'), body_ru, body_en, 
																			 								title('Дата'), date('date'), date('month'), date('year')));
		if (eng == true)
			$('.en').prop('disabled', true);
		else
			$('.en').prop('disabled', false).show();
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