$(document).ready(function() {

	$(".description, .comment, .ticket").popline();

	$('.upload').click(function(event) {
		var title = $('.title').html();
		var s_title = $('.s_title').html();
		var description = $('.description').html();
		alert('cool')
		// $.post('', title: title).done(function() {

		// });
	});

	$('.image_upload').mfupload({

		type		: 'jpg,png,tif,jpeg',
		maxsize		: 2,
		post_upload	: "/edit",
		folder		: "",
		ini_text	: "Drag your files to here or click",
		over_text	: "Drop Here",
		over_col	: '',
		over_bkcol	: 'white',

		init		: function(){ },
		start		: function(result){ },
		loaded		: function(result) {
			$('.image_upload').css('background-image', 'url(' + result.path + ')')
		},
		progress	: function(result){ },
		error		: function(error){ },
		completed	: function(){ }

	});

	$('.m_edit').click(function(event) {
		var th = $(this);
		var marker = $(this).closest('.marker').attr('class').slice(7);
		// var mem = $(this).nextAll('a');
		var mem = $(this).closest('.marker').children('.link');
		// $(this).nextAll('a').remove();

		$.post('/mlist', {status: marker}).done(function(members) {
			var add = $('<div />', {'class':'add'});
			$('.add').remove();
			th.after(add);

			for (var i in members) {
				var add_member = $('<div />', {'class':'add_member', 'text': members[i].ru.name, 'id': members[i]._id});
				$('.add').append(add_member);
				// $('#' + members[i]._id).addClass('select_member');
			}

			for (var i in mem) {
				alert($(mem[i]).attr('id'))
			}

			for (var i in members) {
				for (var j in mem) {
					if ($(mem[j]).attr('id') == members[i]._id) {
						$('#' + members[i]._id).addClass('select_member');
					}
				}
			}
		});
	});

	$(document).on('click', '.add_member', function(event) {
		$(this).toggleClass('select_member');
	});

  $('.toggle_grid').click(function(event) {
  	$('.title, .s_title, .description, .column, .comment, .marker').toggleClass('grid');
  });
});