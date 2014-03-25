$(document).ready(function() {
	var skip = 6;

	function preload(arrayOfImages) {
		$(arrayOfImages).each(function(){
			$('<img />')[0].src = this;
		});
	}

	var random = {
		randNum: 0, randNumOld: 0,
		oMin: 0, oMax: 0,

		getRandomInt: function (min, max) {
			random.oMin = min;
			random.oMax = max;

			random.randNum = Math.floor(Math.random() * (max - min + 1)) + min;
			if (random.randNum == random.randNumOld) random.getRandomInt(random.oMin, random.oMax);
			random.randNumOld = random.randNum;

			return random.randNum;
		}
	}

	function generatePoster () {
		var hide_items = $('.hide').size() - 1;
		var rand_items = random.getRandomInt(0, hide_items);
		var rand_radius = random.getRandomInt(200, 600);

		var atr = $('.hide').eq(rand_items).attr('src');
		$('.image').attr('src', atr);

		$('.main_poster_cal').hide();
		$('.main_poster_cal').eq(rand_items).show();

		$('.round').animate({
			width: rand_radius,
			height: rand_radius
		}, {duration: 400, queue: false})
	}
	generatePoster();

	$('.layer').parallax({
		mouseport: $('.main_poster_img')
	}, {frameDuration:'50'}, {xparallax: '600px', yparallax: '600px'});








	function trimString (str) {
		for (var i = 150; i < str.length; i++) {
			if (str[i] == '.' || str[i] == '?' || str[i] == '!') {
				return str.substr(0, i+1); // ошибка если нет точки в конце
			}
		}
	}

	function ItemConstructor(data, event) {
		skip = skip + event.data.offset;
		var t = 0;

		if (data != 'exit') {
			for (var i in data) {
				var data_date = new Date(data[i].date)
						var d3 = data_date.getDate() < 10 ? '0' + data_date.getDate() : data_date.getDate();
						var month = (data_date.getMonth() + 1) < 10 ? '0' + (data_date.getMonth() + 1) : data_date.getMonth() + 1


				if (t == 3) t = 0;
				var item = $('<div />', {'class':'infinite-item'});
				var link = $('<a />', {'class':'item_link', 'href':'/news/' + data[i]._id});
				var title = $('<div />', {'class':'item_title', 'text': data[i].ru.title.toUpperCase()});
				var date = $('<div />', {'class':'item_date'});
				var d = $('<div />', {'class':'date', 'text': d3});
				var dot = $('<div />', {'class':'dot', 'text': '.'});
				var m = $('<div />', {'class':'month', 'text': month});

				if (data[i].poster)
					var img = $('<img />', {'class':'item_img', 'src': data[i].poster});
				else
					if(data[i].ru.title.length < 20)
						var img = $('<div />', {'class':'item_body', 'lang':'ru', 'html': trimString(data[i].ru.body)});

				$('.infinite-column').eq(t).append(item.append(link.append(title)).append(date.append(d, dot, m)).append(img));

				t++;
			}
			$('.loader').hide();
		}
		else {
			$('.loader').text('больше нет новостей').show();
			$('.maket').off('scroll', ScrollLoader);
			$('.footer_block, .banner_block').show();
		}
	}

	function TagLoader(event) {
		var tag = this.className.slice(9);
		skip = 0;

		$('.footer_block, .banner_block').hide();
		$('.maket').off('scroll', ScrollLoader);
		$('.maket').animate({
			scrollTop: $('.infinite-container').offset().top + $('.maket').scrollTop()
		}, 400, function() {
			$('.infinite-item').hide().promise().done(function() {
				$('.infinite-column').empty();
				$('.loader').text('загрузка...').show();
				$.ajax({
					url: '/',
					data: {tag : tag, offset: skip},
					type: 'POST'
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
				url: '/',
				async: false,
				data: {tag : event.data.tag, offset: skip},
				type: 'POST'
			}).done(function(data) {
				ItemConstructor(data, event);
			});
		}
	}

	function StickyTags() {
		var offset = 0;
		var sticky = false;
		var top = $('.maket').scrollTop();

		if ($('.infinite-container').offset().top < top - 743) {
			$('.tag_navigator').addClass('tag_navigator_sroll');
			sticky = true;
		} else {
			$('.tag_navigator').removeClass('tag_navigator_sroll');
		}
	};

	$('.layer').on('click', generatePoster);
	$('.maket').on('scroll', StickyTags);
	$('.maket').on('scroll', {tag:'all', offset: 6}, ScrollLoader);
	$('.tag_item').on('click', {offset: 0}, TagLoader);
});