$(function() {
/*
	$(window).bind('resize.site', function() {
		var f = ($(window).height() < 750) ? 'removeClass' : 'addClass';
		$('body')[f]('largescreen');
	}).trigger('resize.site');
*/
	
	$('#c-cur-sour').click(function() {
		$('#c-sourcecode').slideToggle( 1000 );
		$('html, body').animate({
			scrollTop: $('#c-current ul').offset().top
		});
		return false;
	});
});