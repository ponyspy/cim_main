$(document).ready(function() {
	$('.section:first, .under_section:first, .content:first').show();
	if (!$('.r_item :first').is(':empty')) {
		$('.r_item :first').show();
	}

	function showBlocks (index_section, index_content) {
		$('.section, .under_section, .content, .r_item').hide();
		$('.section').eq(index_section).show();
		$('.under_section').eq(index_section).show();
		$('.content').eq(index_content).show();

		if (!$('.r_item').eq(index_content).is(':empty'))
			$('.r_item').eq(index_content).show();
	}

	$('.nav_section').each(function() {
		if ($(this).children('.nav_item').length < 2) {
			$(this).addClass('single').children('.nav_item').hide();
			$(this).on('click', function() {
				var index_section = $(this).index('.nav_section');
				var index_content = $(this).children('.nav_item').index('.nav_item');
				showBlocks(index_section, index_content);
			});
		}
	});

	$('.nav_item').on('click', function() {
		var index_section = $(this).closest('.nav_section').index('.nav_section');
		var index_content = $(this).index('.nav_item');
		showBlocks(index_section, index_content);
	});
});