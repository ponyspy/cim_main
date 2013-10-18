$(document).ready(function() {
	var img_preview = 'null';
	$(".description, .comment, .ticket").popline({disable:['color']});

	$('.upload').click(function(event) {
		var title = $('.title').html();
		var s_title = $('.s_title').html();
		var description = $('.description').html();
		var ticket = $('.ticket').html();
		var comment = $('.comment').html();
		var markers = $('.marker .m_list').children('a');
		var members = [];
		console.log(members)

		markers.each(function(index, marker) {
			var id = $(marker).attr('id');
			var status = $(marker).closest('.marker').attr('class').slice(7);
			var comment = $(marker).next('.m_comment').text();
			var member = {
				m_id: id,
				c_status: status,
				comment: comment
			}
			members.push(member);
		});

		var ru = {
			title: title,
			s_title: s_title,
			body: description,
			ticket: ticket,
			comment: comment
		}
		$.post('', {img: img_preview, ru: ru, members: members}).done(function(result) {
			alert(result)
		});
	});

	$('.image_upload').mfupload({

		type		: 'jpg,png,tif,jpeg',
		maxsize		: 2,
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
					$(el).prev('.m_del').show();
				}
				else {
					$(el).hide();
					$(el).prev('.m_del').hide();
				}
		});
	});

	$('.m_edit').click(function(event) {
		var th = $(this);
		var marker = $(this).closest('.marker').attr('class').slice(7);
		$('.m_del').remove();

		$('.marker').removeAttr('style');
		$('.' + marker).css('background-color', '#389177');
		var list = th.next('.m_list').children('a');
		list.each(function(index, el) {
			var del = $('<div />', {'class':'m_del', 'text':'⊖'});
			$(el).before(del);
			$(el).css('clear', 'none');
			$(el).next('.m_comment').css('float', 'none');
		});

		$.post('/mlist', {status: marker}).done(function(members) {
			var add = $('<div />', {'class':'add'});
			var search = $('<input />', {'class':'m_search', 'type':'text', 'placeholder':'поиск'});

			$('.add').remove();
			th.next('.m_list').after(add);
			$('.add').append(search)

			for (var i in members) {
				var m_add = $('<div />', {'class':'m_add', 'text':'⊕'});
				var add_member = $('<a />', {'href':'/member/' + members[i]._id, 'text': members[i].ru.name, 'id': members[i]._id});
				$('.add').append(m_add, add_member);
			}

		});
	});


	$(document).on('click', '.m_add', function(event) {
		var marker = $(this).closest('.marker').attr('class').slice(7);
		var member = $(this).next('a');
		var comment = $('<div />', {'class':'m_comment', 'text': 'привет', 'contenteditable':true});
		var del = $('<div />', {'class':'m_del', 'text':'⊖'});

		$('.' + marker + ' > .m_list').append(del, member, comment);
		// $('.' + marker + ' > .m_list > a').css('clear', 'none');
		$(this).remove();
	});


	$(document).on('click', '.m_del', function(event) {
		$(this).next('a').remove();
		$(this).next('.m_comment').remove();
		$(this).remove();
	});


  $('.toggle_grid').click(function(event) {
  	$('.title, .s_title, .description, .column, .comment, .marker .m_comment').toggleClass('grid');
  });
});