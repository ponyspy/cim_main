$(document).ready(function() {
	var offset = 6;
	$(window).scroll(function() {
	  if($(window).scrollTop() == $(document).height() - $(window).height()) {
	    $('.loader').show();
	    $.ajax({
	    url: "/",
	    data: {tag : 'cool', offset: offset},
	    type: "POST",
	    success: function(data) {
	  		offset = offset + 6;
	      if (data != 'exit') {
	    		for (var i in data) {
	      		var item = $('<div />', {'class':'infinite-item'});
	      		var title = $('<div />', {'class':'title', 'text': data[i].name});
	      		var date = $('<div />', {'class':'date', 'text': data[i].tag});
	      		var img = $('<div />', {'class':'img', 'text':'img'});
	      		$(".infinite-container").append(item.append(title).append(date).append(img));
	    		}
	        $('.loader').hide();
	      }
	      else {
	        $('.loader').html('<center>No more items to show.</center>');
	        $(window).off('scroll');
	      }
	    }
	    });
	  }
	});
});