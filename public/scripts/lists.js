$(document).ready(function() {
	$('.rm_member').click(function(event) {
		var id  = $(this).attr('id');

		if (confirm('Удалить?')) {
			$.post('/auth/edit/members/' + id, {'del': 'true'}).done(function() {
				location.reload();
			});
		}
	});

	$('.rm_news').click(function(event) {
		var id  = $(this).attr('id');

		if (confirm('Удалить?')) {
			$.post('/auth/edit/news/' + id, {'del': 'true'}).done(function() {
				location.reload();
			});
		}
	});

	$('.rm_schedule').click(function(event) {
		var id  = $(this).attr('id');

		if (confirm('Удалить?')) {
			$.post('/auth/add/schedule/2013', {'del': 'true', 'id':id}).done(function() {
				location.reload();
			});
		}
	});
});