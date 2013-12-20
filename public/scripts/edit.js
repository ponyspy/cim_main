$(document).ready(function() {
	var img_preview = 'null';
	$(".description, .comment, .ticket").popline({disable:['color']});

	$("#one").sortable({connectWith: "#two", placeholder: 'column_placeholder', cancel: '.m_comment, .m_search'});
	$("#two").sortable({connectWith: "#one", placeholder: 'column_placeholder', cancel: '.m_comment, .m_search'});

	$('.marker').click(function() {
		console.log('колонка: ' + $(this).parent('.column').index() + '\nэлемент: ' + $(this).index())
	});

	$('.upload').click(function(event) {
		var title = $('.title').html();
		var s_title = $('.s_title').html();
		var description = $('.description').html();
		var ticket = $('.ticket').html();
		var comment = $('.comment').html();
		var p_author = $('.a_name').html();
		var age = $('.age').html();
		var duration = $('.duration').html();
		var hall = $('.hall').val();
		var tag = $('.tag').val();
		var markers = $('.marker .m_list').children('a');
		var members = [];

		markers.each(function(index, marker) {
			var id = $(marker).attr('id');
			var status = $(marker).closest('.marker').attr('class').slice(7);
			var comment = $(marker).next('.m_comment').text();
			var member = {
				m_id: id,
				c_status: status,
				comment: {ru:comment}
			}
			members.push(member);
		});

		var ru = {
			title: title,
			s_title: s_title,
			body: description,
			comment: comment
		}

		if (p_author == '<br>' || p_author == '')
			ru.p_author = '';
		else
			ru.p_author = p_author;


		if (ticket == '<br>' || ticket == '')
			ru.ticket = '';
		else
			ru.ticket = ticket;

		$.post('', {img: img_preview, ru: ru, members: members, tag: tag, hall: hall, age: age, duration: duration}).done(function(result) {
			$('.upload').text('ГОТОВО!');
			setTimeout(function() {
			    $('.upload').text('СОХРАНИТЬ')
			  }, 1000);
		});
	});

	$('.image_upload').mfupload({

		type		: 'jpg,png,tif,jpeg',
		maxsize		: 6,
		post_upload	: "/edit",
		folder		: "",
		ini_text	: "Нажми или перетащи",
		over_text	: "Отпускай!",
		over_col	: '',
		over_bkcol	: 'white',

		init		: function(){ },
		start		: function(result){ },
		loaded		: function(result) {
			$('.image_upload').css('background-image', 'url(' + result.path + ')');
			img_preview = result.path;
		},
		progress	: function(result){ },
		error		: function(error){ },
		completed	: function(){ }

	});


	$(document).on('keyup change', '.m_search', function(event) {
		var value = $(this).val();

		var elems = $('.add').children('a');
		elems.each(function(index, el) {
			var el_val = $(el).html().toLowerCase();
				if (el_val.search(value.toLowerCase()) != -1) {
					$(el).show();
					$(el).prev('.m_add').show();
				}
				else {
					$(el).hide();
					$(el).prev('.m_add').hide();
				}
		});
	});

	$('.m_edit').click(function(event) {
		var th = $(this);
		var marker = $(this).closest('.marker').attr('class').slice(7);
		$('.marker a').removeAttr('style');
		$('.marker').css('padding-bottom', '0px');
		$('.m_del').remove();
		$('.' + marker).css('padding-bottom', '10px');
		$('.m_edit').removeAttr('style');
		th.css('color', 'black');

		var list = th.next('.m_list').children('a');
		list.each(function(index, el) {
			var del = $('<div />', {'class':'m_del', 'text':'⊖'});
			$(el).before(del);
			$(el).css('clear', 'none');
		});

		$.post('/mlist', {status: marker}).done(function(members) {
			var add = $('<div />', {'class':'add'});
			var search = $('<input />', {'class':'m_search', 'type':'text', 'placeholder':'поиск...'});

			$('.add').remove();
			th.closest('.marker').after(add);
			$('.add').append(search)

			for (var i in members) {
				var m_add = $('<div />', {'class':'m_add', 'text':'⊕'});
				var add_member = $('<a />', {'href':'/member/' + members[i]._id, 'text': members[i].ru.name, 'id': members[i]._id});
				$('.add').append(m_add, add_member);
			}

		});
	});


	$(document).on('click', '.m_add', function(event) {
		var marker = $(this).closest('.add').prev('.marker').attr('class').slice(7);
		var member = $(this).next('a').clone();
		var comment = $('<div />', {'class':'m_comment', 'text': 'описание', 'contenteditable':true});
		var del = $('<div />', {'class':'m_del', 'text':'⊖'});

		$('.' + marker + ' > .m_list').append(del, member, comment);
		$('.' + marker + ' > .m_list > a').css('clear', 'none');
		// $(this).remove();
	});


	$(document).on('click', '.m_del', function(event) {
		$(this).next('a').remove();
		$(this).next('.m_comment').remove();
		$(this).remove();
	});

	$('.empty_colums').click(function() {
		$(this).data('clicked', !$(this).data('clicked'));
		$(this).toggleClass('selected');
		$('.add, .m_del').remove();
		$('.m_list a, .m_edit').removeAttr('style');
		$('.marker').css('padding-bottom', '0px');

		if ($(this).data('clicked')) {
			$('.marker').has('.m_list:not(:has(a))').hide();
			$('.m_edit').hide();
		}
		else {
			$('.marker, .m_edit').show();
		}
	});

  $('.toggle_grid').click(function() {
  	$(this).toggleClass('selected');
  	$('.title, .s_title, .description, .column, .comment, .marker .m_comment, .a_name, .age, .duration').toggleClass('grid');
  });
});