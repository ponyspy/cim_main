$(document).ready(function() {
	function formConstructor () {
		var count = $('.child').size();

		var child = $('<div />', {'class':'child'});
		var form_title = $('<div />', {'class':'form_title'});
		var title = $('<input />', {'type':'text', 'name':'children[' + count + '][title]', 'size':'84px'});
		var s_title = $('<input />', {'type':'text', 'name':'children[' + count + '][s_title]', 'size':'84px'});
		$('.children').append(child.append(form_title).append(title).append(title).append(form_title).append(s_title));
	}

	$('.add_child').click(function() {
		formConstructor();
	});
});