$(document).ready(function() {
	$('.content :first').show();
	if (!$('.r_item :first').is(':empty')) {
		$('.r_item :first').show();
	}

	$('.nav_item').click(function(event) {
		$('.content, .r_item').hide();
		var index = $(this).index('.nav_item');
		$('.content').eq(index).show();
		if (!$('.r_item').eq(index).is(':empty'))
			$('.r_item').eq(index).show();
	});
});