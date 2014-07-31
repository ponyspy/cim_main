$(document).ready(function() {

	$('.navigator').click(function(event) {
		var sections_upload = [];

		var sections = $('.section_block');

		sections.each(function(index, el) {
			var section_title = $(this).children('.section_title').html();
			var section_under = $(this).children('.section_under').html();
			var section_content = $(this).find('.content_section_block');

			var content = [];

			section_content.each(function(index, el) {
				var c_title = $(this).children('.content_section_title').html();
				var c_description = $(this).children('.content_section_description').html();
				var c_ticket = $(this).children('.content_section_ticket').html();

				content.push({
					title: c_title,
					description: c_description,
					ticket: c_ticket
				});

			});

			sections_upload.push({
				title: section_title,
				under: section_under,
				content: content
			});

		});

		console.log(sections_upload)
	});

});