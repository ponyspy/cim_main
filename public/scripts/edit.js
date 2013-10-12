$(document).ready(function() {
	var img_preview = 'null';
	$(".description, .comment, .ticket").popline({disable:['color']});

	$('.upload').click(function(event) {
		var title = $('.title').html();
		var s_title = $('.s_title').html();
		var description = $('.description').html();
		var ticket = $('.ticket').html();
		var comment = $('.comment').html();

		var ru = {
			title: title,
			s_title: s_title,
			body: description,
			ticket: ticket,
			comment: comment
		}
		$.post('', {img: img_preview, ru: ru}).done(function(result) {
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

	// $('.marker').click(function(event) {
	// 	var markers = $('.marker .m_list').children('a');
	// 	markers.each(function(index, marker) {
	// 		var id = $(marker).attr('id');
	// 		var status = $(marker).closest('.marker').attr('class').slice(7);
	// 		var comment = $(marker).next('.m_comment').text();
	// 		alert(status + ' ' + id + ' ' + comment)
	// 	});
	// });

	$('.m_edit').click(function(event) {
		var th = $(this);
		var marker = $(this).closest('.marker').attr('class').slice(7);
		// th.next('.m_list').children('a').css('color', 'red');
		var list = th.next('.m_list').children('a');
		// $(this).nextAll('a').remove();

		$.post('/mlist', {status: marker}).done(function(members) {
			var add = $('<div />', {'class':'add'});
			$('.add').remove();
			th.after(add);
			// $('.add').append(list)

			for (var i in members) {
				var add_member = $('<div />', {'class':'add_member', 'text': members[i].ru.name, 'id': members[i]._id});
				$('.add').append(add_member);
			}

		});
	});

	$(document).on('click', '.add_member', function(event) {
		$(this).toggleClass('select_member');
	});

  $('.toggle_grid').click(function(event) {
  	$('.title, .s_title, .description, .column, .comment, .marker .m_comment').toggleClass('grid');
  });
});