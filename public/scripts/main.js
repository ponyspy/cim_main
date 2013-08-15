$(document).ready(function() {
	var skip = 6;

	function preload(arrayOfImages) {
		$(arrayOfImages).each(function(){
			$('<img />')[0].src = this;
		});
	}

	function ItemConstructor(data, event) {
		skip = skip + event.data.offset;
		if (data != 'exit') {
			for (var i in data) {
				var item = $('<div />', {'class':'infinite-item'});
				var link = $('<a />', {'class':'item_link', 'href':'/news/' + data[i]._id});
				var title = $('<div />', {'class':'item_title', 'text': data[i].name});
				var date = $('<div />', {'class':'item_date', 'text': data[i].tag});
				var img = $('<img />', {'class':'item_img', 'src': data[i].img});
				// $('.infinite-container').append(item.append(link).append(title).append(date).append(img));
				$('.infinite-container').append(item.append(link.append(title).append(date).append(img)));
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

		$('.footer_block').hide();
		$(window).off('scroll', ScrollLoader);
		$('body').animate({
			scrollTop: $(".infinite-container").offset().top
		}, 400, function() {
			$('.infinite-item').fadeOut('100').promise().done(function() {
				$('.infinite-container').empty();
				$('.loader').text('Loading...').show();
				$.ajax({
					url: "/",
					data: {tag : tag, offset: skip},
					type: "POST"
				}).done(function(data) {
					skip = 6;

					ItemConstructor(data, event);
					$('.infinite-item').fadeIn('100', function() {
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
				async: false,
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