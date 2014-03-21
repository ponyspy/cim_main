function getRand (arr) {
	var min = 0, max = arr.length - 1;
	var rand = min - 0.5 + Math.random()*(max-min+1)
	return Math.round(rand);
}

var arr_txt = [
	'кексик',
	'карамелька',
	'марципанчик',
	'суфле',
	'ириска'
]

var texts = [
	'Не ко времени и не к месту, для себя и от чистого сердца!',
	'Как говорил один известный компазитор - главное мне ее к роялю подвести!',
	'Науки бывают естественные, неестественные и противоестественные.',
	'Рыба гниет с головы - это опровдание хвоста',
	'Каждая задача имеет два фундаментальных подхода к поиску решения, либо оно будет на столько простым, что очевидно не будет проблем, либо на столько сложным, что очевидных проблем не будет.'
]

$(document).ready(function() {

	var btn = $('<button />', {'class':'lol_btn', 'text':'Наташа?'});

	$('.title').append(btn)
	$('.lol_btn').click(function(event) {
		var rand = getRand(arr_txt);
		$(this).text(arr_txt[rand]);
		$('.background_block').hide();
		$('body').css('background', '#ffa2c4')
		$('input').attr('placeholder', 'Ха ха Наташа кушает конфетки!');
		$('textarea').attr('placeholder', texts[rand]);
	});
});