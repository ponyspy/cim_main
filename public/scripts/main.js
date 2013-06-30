$(document).ready(function() {
	var skip = 6;

	function ItemConstructor(data, event) {
		skip = skip + event.data.offset;
		if (data != 'exit') {
			for (var i in data) {
				var item = $('<div />', {'class':'infinite-item'});
				var title = $('<div />', {'class':'title', 'text': data[i].name});
				var date = $('<div />', {'class':'date', 'text': data[i].tag});
				var img = $('<div />', {'class':'img', 'text':'img'});
				$('.infinite-container').append(item.append(title).append(date).append(img));
			}
			$('.loader').hide();
		}
		else {
			$('.loader').text('No more items to show.').show();
			$(window).off('scroll', ScrollLoader);
			$('.footer_block').show();
		}
	}

	function TagLoader(event) {
		var tag = this.className.slice(9);
		skip = 0;

		$(window).off('scroll', ScrollLoader);
		$('body').animate({
			scrollTop: $(".infinite-container").offset().top
		}, 400, function() {
			$('.infinite-item').fadeOut('200').promise().done(function() {
				$('.infinite-container').empty();
				$.ajax({
					url: "/",
					data: {tag : tag, offset: skip},
					type: "POST"
				}).done(function(data) {
					skip = 6;

					ItemConstructor(data, event);
					$('.infinite-item').fadeIn('200', function() {
						$(window).on('scroll', {tag: tag, offset: 6}, ScrollLoader);
					});
				});
			});
		});
	}

	function ScrollLoader(event) {
		if ($(window).scrollTop() == $(document).height() - $(window).height()) {
			$('.loader').text('Loading...').show();
			$.ajax({
				url: "/",
				data: {tag : event.data.tag, offset: skip},
				type: "POST"
			}).done(function(data) {
				ItemConstructor(data, event);
			});
		}
	}

	function StickyTags() { 
		var offset = 0;
		var sticky = false;
		var top = $(window).scrollTop();
		
		if ($(".infinite-container").offset().top < top) {
			$(".tag_navigator").css('position', 'fixed').css('top', '15px');
			sticky = true;
		} else {
			$(".tag_navigator").css('position', 'relative').css('top', '720px');
		}
	};

$(window).on('scroll', StickyTags);
$(window).on('scroll', {tag:'cool', offset: 6}, ScrollLoader);
$('.tag_item').on('click', {offset: 0}, TagLoader);
});