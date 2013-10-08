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

		$.post('/mlist', {status: marker}).done(function(members) {
			var a = th.closest('.column').index();
			$('.list').eq(1 - a).hide();
			$('.add').eq(1 - a).empty().show();
			for (var i in members) {
				var add_member = $('<div />', {'class':'add_member', 'text': members[i].ru.name, 'id': members[i].id});
				$('.add').eq(1 - a).append(add_member);
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