$(document).ready(function() {
	var eng = true;

	function toggleEnglish () {
		if (eng = !eng) {
			eng = true;
			$('.en').prop('disabled', eng).hide();
			$('.ru').css('float','none');
		}
		else {
			eng = false;
			$('.en').prop('disabled', eng).show();
			$('.ru').css('float','left');			
		}
	}	

	$('.toggle_eng').on('click', toggleEnglish);
});