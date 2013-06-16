$(document).ready(function() {
	var offset = 0;
	function AjaxLoader(event) {
		if($(window).scrollTop() == $(document).height() - $(window).height()) {
			$('.loader').text('Loading...').show();
			$.ajax({
			url: "/",
			data: {tag : 'cool', offset: offset},
			type: "POST",
			success: function(data) {
				offset = event.data.offset + 6;
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
					$(window).off('scroll');
					$('.footer_block').show();
				}
			}
			});
		}
	}


	$('.one').click(function() {
		$('.infinite-container').empty();
		$(window).off('scroll');
		$('body').animate({
			scrollTop: $(".infinite-container").offset().top
		}, 400, function() {
			$(window).on('scroll', {offset:0}, AjaxLoader);
		});
	});


$(window).scroll(function(){ 
		var offset = 0;
		var sticky = false;
		var top = $(window).scrollTop();
		
		if ($(".infinite-container").offset().top < top) {
			$(window).off().on('scroll', {offset:6}, AjaxLoader);
			$(".tag_navigator").css('position', 'fixed').css('top', '0px');
			sticky = true;
		} else {
			$(".tag_navigator").css('position', 'relative').css('top', '720px');
		}
	});

});