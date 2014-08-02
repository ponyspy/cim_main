$(document).ready(function() {
	$('.section:first, .under_section:first, .content:first').show();
	if (!$('.r_item :first').is(':empty')) {
		$('.r_item :first').show();
	}

	$('.nav_item').click(function(event) {
		$('.section, .under_section, .content, .r_item').hide();
		var index_section = $(this).closest('.nav_section').index('.nav_section');
		var index_content = $(this).index('.nav_item');
		$('.section').eq(index_section).show();
		$('.under_section').eq(index_section).show();
		$('.content').eq(index_content).show();

		if (!$('.r_item').eq(index_content).is(':empty'))
			$('.r_item').eq(index_content).show();
	});
});