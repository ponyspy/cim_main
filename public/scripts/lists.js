$(document).ready(function() {
	$('.rm_member').click(function(event) {
		var id  = $(this).attr('id');

		if (confirm('Удалить?\n\nУчастник будет удален из всех событий!')) {
			$.post('/auth/edit/members/' + id, {'del': 'true'}).done(function() {
				location.reload();
				// $(this).parent('.member').remove();
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