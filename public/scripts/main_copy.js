$(document).ready(function() {
	var dd;
	var s = 0;
	var more = $('<a/>', {
     text: 'More',
  'class': 'infinite-more-link',
   'href': '.'
});

	$('.infinite-container').waypoint('infinite', {
	  container: 'auto',
	  items: '.infinite-item',
	  more: '.infinite-more-link',
	  offset: 'bottom-in-view',
	  loadingClass: 'infinite-loading',
	  onBeforePageLoad: function() {
	  	s = s + 6;
	  	$.post('/', {tag: 'cool', skip: s})
	  	.done(function(data) {
 				dd = data;

	  	});
	  },
	  onAfterPageLoad: function() {
	  	var items = $('.infinite-item').slice(-6);
  		$.each(items, function(i) {
        $(this).children('.title').text(dd[i].name);
        $(this).children('.date').text(dd[i].tag);
      });	 
	  }
	});
});