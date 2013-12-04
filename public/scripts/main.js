$(document).ready(function() {
	var skip = 6;
	var last_rand = 0;

	function preload(arrayOfImages) {
		$(arrayOfImages).each(function(){
			$('<img />')[0].src = this;
		});
	}

	function getRandom (min, max) {
		var rand = min - 0.5 + Math.random()*(max-min+1)
		return Math.round(rand);
	}

	function generatePoster () {
		var hide_items = $('.hide').size() - 1;
		var rand_items = getRandom(0, hide_items);

		if (rand_items == last_rand) {
			rand_items = rand_items + 1;
			if (rand_items > hide_items) rand_items = 0;
			last_rand = rand_items;
		}
		else {
			last_rand = rand_items;
		}

		var atr = $('.hide').eq(rand_items).attr('src');
		$('.image').attr('src', atr);

		$('.main_poster_cal').hide();
		$('.main_poster_cal').eq(rand_items).show();
	}
	generatePoster();

	$('.layer').parallax({
		mouseport: $('.main_poster_img')
	}, {frameDuration:'50'}, {xparallax: '600px', yparallax: '600px'});

	$('.layer').click(function() {
		var rand_radius = getRandom(200, 600);
		generatePoster();

		$('.round').animate({
			width: rand_radius,
			height: rand_radius
		}, {duration: 400, queue: false})
	});

	function trimString (str) {
		for (var i = 150; i < str.length; i++) {
			if (str[i] == '.' || str[i] == '?' || str[i] == '!') {
				return str.substr(0, i+1); // ошибка если нет точки в конце
			}
		}
	}

	function zeroDate (date) {
		if (date < 10)
			return '0' + date;
		else
			return date;
	}

	function ItemConstructor(data, event) {
		skip = skip + event.data.offset;
		var t = 0;

		if (data != 'exit') {
			for (var i in data) {
				var d2 = new Date(data[i].date)
						var d3 = d2.getDate();
						var month = d2.getMonth()+1;


				if (t == 3) t = 0;
				var item = $('<div />', {'class':'infinite-item'});
				var link = $('<a />', {'class':'item_link', 'href':'/news/' + data[i]._id});
				var title = $('<div />', {'class':'item_title', 'text': data[i].ru.title.toUpperCase()});
				// var tag = $('<div />', {'class':'item_date', 'text': data[i].tag});
				var date = $('<div />', {'class':'item_date'});
				var d = $('<div />', {'class':'date', 'text': zeroDate(d3)});
				var dot = $('<div />', {'class':'dot', 'text': '.'});
				var m = $('<div />', {'class':'month', 'text': zeroDate(month)});
				if (data[i].poster)
					var img = $('<img />', {'class':'item_img', 'src': data[i].poster});
				else
					if(data[i].ru.title.length < 20)
						var img = $('<div />', {'class':'item_body', 'lang':'ru', 'html': trimString(data[i].ru.body)});
				// $('.infinite-container').append(item.append(link).append(title).append(date).append(img));
				$('.infinite-column').eq(t).append(item.append(link.append(title)).append(date.append(d, dot, m)).append(img));
				// $('.infinite-column').eq(t).append(item.append(link.append(title, date, img)));
				t++;
			}
			$('.loader').hide();
		}
		else {
			$('.loader').text('больше нет новостей').show();
			$(window).off('scroll', ScrollLoader);
			$('.footer_block, .banner_block').show();
		}
	}

	function TagLoader(event) {
		var tag = this.className.slice(9);
		skip = 0;

		$('.footer_block, .banner_block').hide();
		$('.maket').off('scroll', ScrollLoader);
		$('.maket').animate({
			scrollTop: $(".infinite-container").offset().top
		}, 400, function() {
			$('.infinite-item').hide().promise().done(function() {
				$('.infinite-column').empty();
				$('.loader').text('загрузка...').show();
				$.ajax({
					url: "/",
					data: {tag : tag, offset: skip},
					type: "POST"
				}).done(function(data) {
					skip = 6;

					ItemConstructor(data, event);
					$('.infinite-item').show(function() {
						$('.maket').on('scroll', {tag: tag, offset: 6}, ScrollLoader);
					});
				});
			});
		});
	}

	function ScrollLoader(event) {
		var maket = $('.maket').height();
		var cont = $('.infinite-container').height();

		if (cont - maket <= $('.maket').scrollTop() - 350) {
			$('.loader').text('загрузка...').show();
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
		var top = $('.maket').scrollTop();

		if ($(".infinite-container").offset().top < top - 743) {
			$(".tag_navigator").addClass('tag_navigator_sroll');
			sticky = true;
		} else {
			$(".tag_navigator").removeClass('tag_navigator_sroll');
		}
	};

$('.maket').on('scroll', StickyTags);
$('.maket').on('scroll', {tag:'all', offset: 6}, ScrollLoader);
$('.tag_item').on('click', {offset: 0}, TagLoader);
});