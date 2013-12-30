$(document).ready(function() {
	$('.content :first').show();

	$('.nav_item').click(function(event) {
		$('.content').hide();
		var index = $(this).index('.nav_item');
		$('.content').eq(index).show();
		var right_append = $('.content').eq(index).children('.r_append').html();
		if (right_append) {
			$('.right_block').show().html(right_append);
		}
		else
			$('.right_block').hide();
	});
});