$(document).ready(function() {
	$('.content :first').show();

	$('.nav_item').click(function(event) {
		$('.content').hide();
		var index = $(this).index('.nav_item');
		$('.content').eq(index).show()
	});
});