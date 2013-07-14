$(document).ready(function() {
	var count = $('.child').size();
	var eng = true;
	var event = false;
	var project = false;
	var news = false;

	/*
	Toggles Block
	*/

	function checkEnglish () {
		if (eng == true)
			$('.en').prop('disabled', true);
		else
			$('.en').prop('disabled', false).show();		
	}

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

	function toggleNews () {
		if (news = !news) {
			$('.nav_title').text('НОВОСТЬ');
			$('.form_block_event').toggle();
			$('.form_block_project').toggle();
			$('.nav_project_children').hide();
			$('.news_tag').prop('disabled', false);
			project = false;
			event = false;
		}
	}

	function toggleEvent () {
		if (event = !event) {
			$('.nav_title').text('СОБЫТИЕ');
			$('.form_block_event').toggle();
			$('.form_block_event > select').prop('disabled', false);
			$('.form_block_event >.actors > select').prop('disabled', false);
			$('.news_tag').prop('disabled', true);
		}
		else {
			$('.nav_title').text('НОВОСТЬ');
			$('.form_block_event').toggle();
			$('.form_block_event > select').prop('disabled', true);
			$('.form_block_event >.actors > select').prop('disabled', true);
			$('.news_tag').prop('disabled', false);
		}
	}

	function toggleProject () {
		if (project = !project) {
			$('.nav_title').text('СПЕЦПРОЕКТ');
			if (count == 1) {
				var nav_project_child = $('<div />', {'class':'nav_project_child', 'text':'Событие ' + (count)});
				$('.nav_project_children').append(nav_project_child);
			}
			$('.nav_project_children').show();
			if (count == 0) projectConstructor();
			$('.form_block_project').toggle();
			$('.form_block_event > select').slice(-4).prop('disabled', true);
			$('.child > select').prop('disabled', false);
			$('.child > .actors > select').prop('disabled', false);
			$('.child > input').prop('disabled', false);
			$('.child > textarea').prop('disabled', false);
		}
		else {
			$('.nav_title').text('СОБЫТИЕ');
			$('.nav_project_children').hide();
			$('.form_block_project').toggle();
			$('.form_block_event > select').slice(-4).prop('disabled', false);
			$('.child > select').prop('disabled', true);
			$('.child > .actors > select').prop('disabled', true);
			$('.child > input').prop('disabled', true);
			$('.child > textarea').prop('disabled', true);			
			count = $('.child').size();
		}
	}

		/*
	Constructors Block
	*/

	function actorConstructor () {
		var elem = $(this).parent().find('select');
		elem.first().clone().insertAfter(elem.last())
	}

	function actorDelete () {
		var elem = $(this).parent().find('select :last').remove();
	}

	function projectConstructor () {
		count = $('.child').size();

		var nav_project_child = $('<div />', {'class':'nav_project_child', 'text':'Событие ' + (count+1)});
		$('.nav_project_children').append(nav_project_child);		

		$('.child :first').clone(true, true).insertAfter('.child :last');

		$('.child').eq(count).children('.child_counter').text('Событие ' + (count+1));

		var forms = $('.child').eq(count).children('select, input, textarea');
		forms.each(function() {
			var value = $(this).attr('name');
			value = value.replace('0', count);
			$(this).attr('name', value);
		});

		var snakes = $('.child').eq(count).find('.actors > select');
		var value = snakes.attr('name');
		value = value.replace('0', count);
		snakes.attr('name', value);

		checkEnglish();
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
	$('.news_convert').on('click', toggleNews);
	$('.add_actor').on('click', actorConstructor);
	$('.delete_actor').on('click', actorDelete);

	$('.form_submit').click(function() {
		$('form').submit();
	});
});