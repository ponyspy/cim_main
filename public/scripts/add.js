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

	// function toggleEvent () {
	// 	if (event = !event) {
	// 		$('.nav_title').text('СОБЫТИЕ');
	// 		$('.form_block_event').toggle();
	// 		$('.form_block_event > select').prop('disabled', false);
	// 		$('.form_block_event >.snake > select').prop('disabled', false);
	// 	}
	// 	else {
	// 		$('.nav_title').text('НОВОСТЬ');
	// 		$('.form_block_event').toggle();
	// 		$('.form_block_event > select').prop('disabled', true);
	// 		$('.form_block_event >.snake > select').prop('disabled', true);
	// 	}
	// }

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
			$('.form_block_event > select').slice(-1).prop('disabled', true);
			$('.child > select').prop('disabled', false);
			$('.child > .snake > select').prop('disabled', false);
			$('.child > input').prop('disabled', false);
			$('.child > file').prop('disabled', false);
			$('.child > textarea').prop('disabled', false);
		}
		else {
			$('.nav_title').text('СОБЫТИЕ');
			$('.nav_project_children').hide();
			$('.form_block_project').toggle();
			$('.form_block_event > select').slice(-1).prop('disabled', false);
			$('.child > select').prop('disabled', true);
			$('.child > .snake > select').prop('disabled', true);
			$('.child > input').prop('disabled', true);
			$('.child > file').prop('disabled', true);
			$('.child > textarea').prop('disabled', true);
			count = $('.child').size();
		}
	}

		/*
	Constructors Block
	*/

	function snakeForward () {
		var elem = $(this).parent().find('select');
		elem.first().clone().insertAfter(elem.last())
	}

	function snakeBack () {
		if ($(this).parent().find('select').size() == 1) return null;
		$(this).parent().find('select :last').remove();
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

		var snakes = $('.child').eq(count).find('.snake > select');
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
	// $('.event_convert').on('click', toggleEvent);
	$('.project_convert').on('click', toggleProject);
	$('.back').on('click', snakeBack);
	$('.forward').on('click', snakeForward);

	$('.form_submit').click(function() {
		var newValue = $('textarea').val().replace(/\n/g, "<br />");
		// alert(newValue)
		$('textarea').val(newValue);
		$('form').submit();
	});
});