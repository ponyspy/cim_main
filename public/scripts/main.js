$(document).ready(function() {
	var skip = 6;

	function AjaxLoader(event) {
		if ($(window).scrollTop() == $(document).height() - $(window).height()) {
			$('.loader').text('Loading...').show();
			$.ajax({
			url: "/",
			data: {tag : event.data.tag, offset: skip},
			type: "POST",
			success: function(data) {
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
					$(window).off('scroll', AjaxLoader);
					$('.footer_block').show();
				}
			}
			});
		}
	}


	$('.tag_item').click(function() {
		$(window).off('scroll', AjaxLoader);
		$('body').animate({
			scrollTop: $(".infinite-container").offset().top
		}, 400, function() {
			skip = 0;
			var items = $('.infinite-item').slice(6);
			items.remove();
			$(window).on('scroll', {tag:'zlo', offset:6}, AjaxLoader);
		});
	});


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
$(window).on('scroll', {tag:'cool', offset:6}, AjaxLoader);

});