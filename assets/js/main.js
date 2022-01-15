/*
	Fractal by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/
myStorage = window.sessionStorage;
localData = localDataStorage( 'passphrase.life' )

$(".pain_img").on("click", function(){
	var body_parts = localData.get('body_parts');
	var selected_part = localData.get('selected_part');
	for(var i = 0; i < body_parts.length; i++) {
		if(body_parts[i].part == selected_part) {
			body_parts[i].pain = this.id
			localData.set('body_parts', body_parts)
			break;
		}
	}
	$("img[id=body_diagram]").show()
	$("div[id=pain_scale]").hide()

});

$("div[id=pain_scale]").hide()
// on click on body part, set the value to myStorage
$("map[name=parts] area").on('click', function () {
    var selected_part = $(this).attr('id');
	localData.set("selected_part", selected_part);
	var body_parts = localData.get('body_parts')
	body_parts.push({'part': selected_part, 'pain': null})
	localData.set('body_parts', body_parts);

	$("img[id=body_diagram]").hide()
	$("div[id=pain_scale]").show()
	$("p[class=header__sub-title]").html("Please mark how much it hurts on your " + selected_part)
});

function saveName() {
	event.preventDefault();
	localData.clear()
	var patient_name = $("input[id=pname]").val()
	localData.set('patient_name', patient_name);

	localData.set('body_parts', []);
	$("p[class=header__sub-title]").html('Patient: ' + patient_name)
}

(function($) {

	var	$window = $(window),
		$body = $('body');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ],
			xxsmall:  [ null,      '360px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Mobile?
		if (browser.mobile)
			$body.addClass('is-mobile');
		else {

			breakpoints.on('>medium', function() {
				$body.removeClass('is-mobile');
			});

			breakpoints.on('<=medium', function() {
				$body.addClass('is-mobile');
			});

		}

	// Scrolly.
		$('.scrolly')
			.scrolly({
				speed: 1500
			});

})(jQuery);