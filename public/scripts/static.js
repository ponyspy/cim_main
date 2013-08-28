$(document).ready(function() {
	$('.content :first').show();

	$('.nav_item').click(function(event) {
		$('.content').hide();
		var index = $(this).index();
		$('.content').eq(index).show()
	});
});