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
	$("p[class=header__sub-title]").html("Please mark on these pictures where it is that you hurt")
	updatePainList();

});

$( document ).ready(function() {
	console.log("ready")
	updatePainList()

})

function updatePainList() {
	var body_parts = localData.get('body_parts');
	var selected_part_name = localData.get('selected_part_name')
	$("#patient_data").empty();
	for (let i = 0; i < body_parts.length; i++) {
		$("#patient_data").append('<li><h3>' + body_parts[i]['part name'] + ': Pain Level ' + body_parts[i].pain + '</h3></li>');
	}
}

$("a[id=needs-icon]").on('click', function () {
	var selected_need = $(this).attr('name');
	$("h1[id=result]").html(selected_need)
	
});


$("div[id=pain_scale]").hide()
$("div[id=data-summary]").hide()
$("div[id=parts-summary]").hide()
// on click on body part, set the value to myStorage
$("map[name=parts] area").on('click', function () {
    var selected_part = $(this).attr('id');
	var selected_part_name = $(this).attr('alt');

	localData.set("selected_part", selected_part);
	localData.set("selected_part_name", selected_part_name);
	var body_parts = localData.get('body_parts')
	var exists = false;
	for (let i = 0; i < body_parts.length; i++) {
		if (body_parts[i].part == selected_part) {
			body_parts[i].pain = null;
			exists = true;
			break;
		}
	}
	if (exists == false) {
		body_parts.push({'part name': selected_part_name, 'part': selected_part, 'pain': null})
	}
	localData.set('body_parts', body_parts);

	$("img[id=body_diagram]").hide()
	$("div[id=pain_scale]").show()
	$("p[class=header__sub-title]").html("Please mark how much it hurts on your " + selected_part_name)
});

function submitScale1() {
	event.preventDefault();
	data = {};
	data.pain = $('input[name="Pain"]:checked').val();
	data.tiredness = $('input[name="Tiredness"]:checked').val();
	data.drowsiness = $('input[name="Drowsiness"]:checked').val();
	data.nausea = $('input[name="Nausea"]:checked').val();
	data.appetite = $('input[name="Lack of Appetite"]:checked').val();
	localData.set('data', data);
	window.location.replace('scale2')
}

function submitScale2() {
	event.preventDefault();
	const d = new Date();
	data = localData.get('data');
	data.breath = $('input[name="Shortness of Breath"]:checked').val();
	data.depression = $('input[name="Depression"]:checked').val();
	data.anxiety = $('input[name="Anxiety"]:checked').val();
	data.wellbeing = $('input[name="Wellbeing"]:checked').val();
	data.date = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}`

	localData.set('data', data);


	const dbRef = firebase.database().ref();
	dbRef.child("patients").get().then((snapshot) => {
		if (snapshot.exists()) {
			var userExists = false;
			var idx = -1;
			for (let i = 0; i < snapshot.val().length; i++) {
				if(localData.get('patient_name') == snapshot.val()[i].name) {

					userExists = true;
					idx = i;
					break;
				}
			}

			var body_part_toPush = {}
			var body_parts = localData.get('body_parts')
			for(var i = 0; i < body_parts.length; i++){
				part_name = body_parts[i]["part name"]
				body_part_toPush[part_name] = body_parts[i].pain
			}

			if ( userExists ) {
				var body_parts_len = snapshot.val()[idx].body_parts.length
				var data_len = snapshot.val()[idx].data.length

				dbRef.child("patients").child(idx).child("body_parts").update({
					[body_parts_len]: body_part_toPush
				})
				dbRef.child("patients").child(idx).child("data").update({
					[data_len]: data
				})
			} else {
				var patients_len = snapshot.val().length
				dbRef.child("patients").child(patients_len).set({
					"body_parts": {
						0: body_part_toPush
					},
					"data": {
						0: data
					},
					"id": patients_len,
					"name": localData.get('patient_name')
				})
			}

			window.location.replace('index')
		} else {
		alert("No data available");
		}
	})

}

function getPatients() {
	dbRef.child("patients").get().then((snapshot) => {
		if (snapshot.exists()) {
			var patients_len = snapshot.val().length;
			var patient_arr = []
			for (let i = 0; i < patients_len; i++) {
				var patient_name = snapshot.val()[i].name
				$("select[name=patient-selector]").append(`<option value=\"${i}\">${patient_name}</option>`)
			}

		}
	})
}


// $('#scale1 input').on('change', function() {
// 	alert($('input[name=0]:checked', '#scale1').val());
//  });


function saveName() {
	event.preventDefault();
	localData.clear()
	var patient_name = $("input[id=pname]").val()
	localData.set('patient_name', patient_name);

	localData.set('body_parts', []);
	$("p[class=header__sub-title]").html('Patient: ' + patient_name)
	window.location.replace('bodyparts.html')
}


function showData(){
	dbRef.get().then((snapshot) => {
		if (snapshot.exists()) {
			var data = snapshot.val();
			console.log(data)
			event.preventDefault();
			var patient_id = $("select[id=patient]").val();
			var pat = 0;
			for(var i=0;i<data.patients.length;i++){
				console.log(data.patients[i].id + patient_id)
				if(data.patients[i].id == patient_id){
					pat = data.patients[i];
				}
			}
			$("div[id=data-summary]").show();
			$("div[id=parts-summary]").show();

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
			heading_1.innerHTML = "Date";
			row_1.appendChild(heading_1);
			var x = 0;
			var max = 0;
			console.log(typeof pat.data)
			for(var i=0;i<pat.data.length;i++){
				var k = Object.keys(pat.data[i]).length;
				if(k > max){
					x = i;
				}
			}
			for(var keys in pat.data[x]){
				if(keys !== "date"){
					heading_1 = document.createElement('th');
					heading_1.innerHTML = keys;
					row_1.appendChild(heading_1);
				}
			}
			thead.appendChild(row_1);

			let row = document.createElement('tr');
			let row_data = document.createElement('td');
			for(let i=0;i<pat.data.length;i++){
				row = document.createElement('tr');
				row_data = document.createElement('td');
				row_data.innerHTML = pat.data[i]["date"];
				row.appendChild(row_data);
				for(var keys in pat.data[i]){
					if(keys !== "date")
					{
						row_data = document.createElement('td');
						row_data.innerHTML = pat.data[i][keys];
						row.appendChild(row_data);
					}

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
		} else {
		console.log("No data available");
		}
	})

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