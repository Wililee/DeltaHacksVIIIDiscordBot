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
$("div[id=data-summary]").hide()
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

function showData(){
	data = {
		"patients":[
			{
				"id":"1",
				"name":"Gerald",
				"data":[
					{
						"date": "March 1, 2022",
						"pain":4,
						"tiredness":3,
						"anxiety": 7,
						"wellbeing":10
					},
					{
						"date": "March 2, 2022",
						"pain":2,
						"tiredness":2,
						"anxiety": 5,
						"wellbeing":10
					}
				],
				"body_parts":[
					{
						"head":6,
						"left hand":1
					}
				]
			},
			{
				"id":"2",
				"name":"Alice",
				"data":[
					{
						"date": "March 3, 2022",
						"pain":3,
						"tiredness":3,
						"anxiety": 3
					},
					{
						"date": "March 1, 2022",
						"pain":1,
						"tiredness":2,
						"anxiety": 1
					}
				],
				"body_parts":[
					{
						"head":3,
						"left hand":9
					},
				]
			}
		]};
	event.preventDefault();
	var patient_id = $("select[id=patient]").val();
	localData.set('patient_id', patient_id);
	const [key, pat] = Object.entries(data.patients).find(([key, pat]) => pat.id === patient_id);
	$("div[id=data-summary]").show();

	let table = document.createElement('table');
	table.id = "data-table"
	let thead = document.createElement('thead');
	let tbody = document.createElement('tbody');

	table.appendChild(thead);
	table.appendChild(tbody);

	// Adding the entire table to the body tag
	var obj = document.getElementById('data-summary');
	var tab = document.getElementById('data-table')
	if(tab){
		tab.parentNode.removeChild(tab);
	}
	obj.appendChild(table);

	// Creating and adding data to first row of the table
	let row_1 = document.createElement('tr');
	let heading_1 = document.createElement('th');
	for(var keys in pat.data[0]){
		heading_1 = document.createElement('th');
		heading_1.innerHTML = keys;
		row_1.appendChild(heading_1);
	}
	thead.appendChild(row_1);

	let row = document.createElement('tr');
	let row_data = document.createElement('td');
	for(let i=0;i<pat.data.length;i++){
		row = document.createElement('tr');
		for(var keys in pat.data[i]){
			row_data = document.createElement('td');
			row_data.innerHTML = pat.data[i][keys];
			row.appendChild(row_data);
		}
		tbody.appendChild(row);
	}

	table = document.createElement('table');
	table.id = "parts-table"
	thead = document.createElement('thead');
	tbody = document.createElement('tbody');

	table.appendChild(thead);
	table.appendChild(tbody);

	// Adding the entire table to the body tag
	obj = document.getElementById('parts-summary');
	tab = document.getElementById('parts-table')
	if(tab){
		tab.parentNode.removeChild(tab);
	}
	obj.appendChild(table);

	// Creating and adding data to first row of the table
	row_1 = document.createElement('tr');
	heading_1 = document.createElement('th');
	for(var keys in pat.body_parts[0]){
		heading_1 = document.createElement('th');
		heading_1.innerHTML = keys;
		row_1.appendChild(heading_1);
	}
	thead.appendChild(row_1);

	row = document.createElement('tr');
	row_data = document.createElement('td');
	for(let i=0;i<pat.body_parts.length;i++){
		row = document.createElement('tr');
		for(var keys in pat.body_parts[i]){
			row_data = document.createElement('td');
			row_data.innerHTML = pat.body_parts[i][keys];
			row.appendChild(row_data);
		}
		tbody.appendChild(row);
	}
}

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