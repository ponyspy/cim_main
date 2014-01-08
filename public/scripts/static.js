$(document).ready(function() {
	$('.content :first').show();

	$('.nav_item').click(function(event) {
		$('.content, .r_item').hide();
		var index = $(this).index('.nav_item');
		$('.content').eq(index).show();
		if (!$('.r_item').eq(index).is(':empty'))
			$('.r_item').eq(index).show();
	});
});