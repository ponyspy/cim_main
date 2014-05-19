$(document).ready(function() {
	$('.dropzone').filedrop({
		url: '/upload',
		paramname: 'photo',
		fallback_id: 'upload_button',
		allowedfiletypes: ['image/jpeg','image/png','image/gif'],
		allowedfileextensions: ['.jpg','.jpeg','.png','.gif'],
		maxfiles: 15,
		maxfilesize: 20,
		dragOver: function() {
			$(this).css('background-color', '#c9a2ae');
		},
		dragLeave: function() {
			$(this).removeAttr('style');
		},
		uploadStarted: function(i, file, len) {
			var photo = $('<div/>', {'class':'photo'});
			var scale = $('<div/>', {'class':'scale'});

			photo.append(scale);
			$('.photos').prepend(photo);
		},
		uploadFinished: function(i, file, response, time) {
			$('.photo').eq(i).css('background-image', 'url(' + response + ')')
		},
		progressUpdated: function(i, file, progress) {
			$('.photo').eq(i).children('.scale').text(progress + '%').css('width', progress + '%');
		},
		afterAll: function() {
			$('.dropzone').removeAttr('style');
		}
	});

	$(document).on('dblclick', '.photo', function() {
		alert($(this).attr('style'))
		$(this).remove();
	});

});