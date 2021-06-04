var w = $(window).width();
var h = $(window).height();

var img_w = $(window).width() / 8.0;
var img_h = $(window).height() / 4.0;
var radius = 14;



var mymap = L.map('map-holder', {
	zoom: 2,
	maxZoom: 19,
	scrollWheelZoom: true,
	zoomControl: false,
	noWrap: true,
	zoomAnimation: true,
	markerZoomAnimation: true,
	maxBoundsViscosity: 0.8,
	maxBounds: [
		[89.9, 220.9],
		[-89.9, -220.9]
	]
}).setView([0, 0]);


L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 19,
	bounds: [
		[89.9, 220.9],
		[-89.9, -220.9]
	]

}).addTo(mymap);

mymap.setMinZoom(mymap.getBoundsZoom([[50.9, 160.9], [-50.9, -160.9]]));

var curr_value = null;
var curr_marker = null;



$(window).resize(function () {
	if (curr_value) {
		var frame = document.getElementById(curr_value.id);
		var wn = $(window).width();
		var hn = $(window).height();
		frame.width = wn * 0.6;
		frame.height = hn * 0.6;

	}
});

mymap.on('popupopen', function (e) {
	sidebar.close();
	curr_marker = e.target._popup._source;

	var px = mymap.project(e.target._popup._latlng); // find the pixel location on the map where the popup anchor is

	px.y -= e.target._popup._container.clientHeight / 3; // find the height of the popup container, divide by 2, subtract from the Y axis of marker location
	mymap.panTo(mymap.unproject(px), { animate: true }); // pan to new center
	mymap.setView(mymap.unproject(px), mymap.getZoom() + 1);

	curr_value = e.target._popup._source.options.data_object;
});

function setUpFrame () {
	var frame = window.frames['frame-' + curr_value.id];
	frame.populate(curr_value);
}

var myStyle = {
	"weight": 1,
	"opacity": 0.65

};


var markers = [];
var currlinks= [];
var currpath=null;
var deathmarker=null;

// This function is in charge of filtering the markers as we wish
// input: list of professions and 
function updateMarkers (professionConstrain, birthFrom, birthTo) {
	maxActive = 50;
	currActive = 0;
	currlinks.forEach(function(entry) {
		    entry.remove();
		    // console.log("here")
	})
	currlinks=[]
	var gps=[]
	
	markers.forEach(function (d, i) {
		var activate = true;
		// Profession filter

		if (professionConstrain.length > 0) {
			if (!professionConstrain.includes(d.data.occupation)) {
				activate = false;
			}
		}

		//Birth from filter
		if (birthFrom != null) {
			if (parseInt(d.data.birthyear) < birthFrom) {
				activate = false;
			}
		}

		if (birthTo != null) {
			if (parseInt(d.data.birthyear) > birthTo) {
				activate = false;
			}
		}

		//Deactivate if not on the visible part of map
		if (!mymap.getBounds().contains(d.marker.getLatLng())) {
			activate = false;
		}

		// Array is sorted by decreasing HPI, so we just have to count
		// the activated markers to get region top fames.
		if (activate) {
			currActive = currActive + 1;
			if (currActive > maxActive) {
				activate = false;
			}
		}

		if (!d.active && activate) {
			mymap.addLayer(d.marker);
			d.active = true;
		} else if (d.active && !activate && (curr_marker == null || curr_marker.options.data_object.id != d.marker.options.data_object.id)) {
			mymap.removeLayer(d.marker);
			d.active = false;
		}
	});

	markers.forEach(function (d, i) {
		ltln=d.marker.getLatLng()
		// console.log(ltln)
		if(d.active)
			gps.push([parseFloat(ltln.lat),parseFloat(ltln.lng)])
	});
	

	if(professionConstrain.length > 0){
		// console.log(gps.length,gps)
		for (var i = 0; i < gps.length-1; i++) { 
			if(!(gps[i][0]===gps[i+1][0]) && !(gps[i][1]===gps[i+1][1]))
				currlinks.push(L.Polyline.Arc(gps[i], gps[i+1], {
					    vertices: 200,
					    weight: 1,
					    opacity: 0.5,
				}))
		}
		currlinks.forEach(function(entry) {
		    entry.addTo(mymap);
		})
	}

}

var minimumYear = 0;
var maximumYear = new Date().getFullYear() //Use the current year, but check in dataset anyway in case of browser issues
var slider = null;

const data = d3.csv("https://mbien-public.s3.eu-central-1.amazonaws.com/com-480/dataset.csv");
data.then(function (data) {

	var professionOptions = [];

	data.forEach(function (d, i) {

		var longitude = parseFloat(d.bplace_lon) + Math.random() * 0.1; //Counter the exact same position on map eg. Paris
		var latitude = parseFloat(d.bplace_lat) + Math.random() * 0.1;
		var imgname = d.pic.split("/");
		var imgname = imgname[imgname.length - 1];

		var img = "<img src='https://commons.wikimedia.org/w/thumb.php?width=64&f=" + imgname + "' loading='lazy' />";

		popupContent = document.createElement("iframe");
		popupContent.style.overflow = "hidden";
		popupContent.name = 'frame-' + d.id;
		popupContent.src = "popup.html";
		popupContent.width = w * 0.6;
		popupContent.height = h * 0.6;
		popupContent.id = d.id;

		class_img = 'image-icon_d';
		if (d.birthyear && !d.deathyear) {
			class_img = 'image-icon_a';
		}

		var marker = L.marker(L.latLng(latitude, longitude), {
			icon: L.divIcon({
				html: img,
				// Specify a class name we can refer to in CSS.
				className: class_img,
				// Set a markers width and height.
				iconSize: [20, 20],
				iconAnchor: [30, 30],
			}),
			title: d.name,
			data_object: d,
		}).bindPopup(popupContent, {
			maxWidth: "auto"
		});

		if(d.dplace_lat){
			marker.on('mouseover',function(ev) {
				if(currpath){
					mymap.removeLayer(currpath);
				}
				if(deathmarker){
					mymap.removeLayer(deathmarker);
				}
				

				var route = [[latitude , longitude],[d.dplace_lat,d.dplace_lon]]
				for (var i = 0, latlngs = [], len = route.length; i < len; i++) {
						latlngs.push(new L.LatLng(route[i][0], route[i][1]));
					}
				currpath = L.polyline(latlngs);
				mymap.addLayer(currpath);
				currpath.snakeIn();
				currpath.on('snakeend', function(ev){
					deathmarker = L.circle(L.latLng([d.dplace_lat,d.dplace_lon]), {
								    color: 'white',
								    fillColor: '#f03',
								    fillOpacity: 0.5,
								    radius: 50
								}).addTo(mymap)
					var dyear=d.deathyear
					if (parseInt(dyear) < 0) {
						dyear = parseInt(dyear.replace('-', '')) + ' B.C'
					}
					else {
						dyear = parseInt(dyear)//+' A.D'
					}
					deathmarker.bindTooltip(d.name+" died in "+d.dplace_name+" in the year "+dyear).openTooltip();
				});
			});

			marker.on('mouseout',function(ev) {
				if(currpath){
					mymap.removeLayer(currpath);
				}
				if(deathmarker){
					mymap.removeLayer(deathmarker);
				}
				
			  currpath=null;
			  deathmarker=null;
			});
		}

		markers.push({
			'data': d,
			'marker': marker,
			'active': false
		});

		minimumYear = Math.min(minimumYear, parseInt(d.birthyear));
		maximumYear = Math.max(maximumYear, parseInt(d.birthyear));

		professionOptions.push(d.occupation);
	});

	//Load the profession data into selector
	var professionOptionsUnique = professionOptions.filter(function (value, index, self) {
		return self.indexOf(value) === index;
	});

	var professionOptionsReady = professionOptionsUnique.map(function (value, index, self) {
		return { id: index, text: value };
	});

	$('#profession-selector').select2({
		placeholder: 'Select an option',
		width: 'resolve',
		data: professionOptionsReady,
		dropdownParent: $(".sidebar-content")
	});

	updateMarkers([], minimumYear, maximumYear);

	slider = document.getElementById('lifespan-slider');
	noUiSlider.create(slider, {
		start: [minimumYear, maximumYear],
		connect: true,
		range: {
			'min': minimumYear,
			'max': maximumYear
		},
		format: wNumb({
			decimals: 0
		})
	});

	slider.noUiSlider.on('update', function (values, handle) {
		if (handle) {
			toValue.value = values[handle];
		} else {
			fromValue.value = values[handle];
		}
	
		var selected = $('#profession-selector').find(':selected').toArray().map(option => option.text);
		updateMarkers(selected, fromValue.value, toValue.value);
	});
});

var sidebar = L.control.sidebar('sidebar');
mymap.addControl(sidebar);
var zoomControl = L.control.zoom({ position: 'topright' }).addTo(mymap);

var fromValue = document.getElementById('from');
var toValue = document.getElementById('to');

mymap.on("zoomstart", function () {
	let selected = $('#profession-selector').find(':selected').toArray().map(option => option.text);
	updateMarkers(selected, fromValue.value, toValue.value);
});
mymap.on("moveend", function () {
	let selected = $('#profession-selector').find(':selected').toArray().map(option => option.text);
	updateMarkers(selected, fromValue.value, toValue.value);
});

$('#profession-selector').on('select2:select select2:unselect', function (e) {
	let selected = $('#profession-selector').find(':selected').toArray().map(option => option.text);
	updateMarkers(selected, fromValue.value, toValue.value);
});

var fastForwarder = null;
var fastForwarderDiff = 0;
var velocity = 1;
document.getElementById("lifespan-play").addEventListener("click", function () {
	if (fastForwarder == null) {
		fastForwarderDiff = parseInt(toValue.value) - parseInt(fromValue.value);
		$("#play-icon").removeClass("fa-play").addClass("fa-pause")
		fastForwarder = setInterval(function () {
			toValue.value = Math.min(maximumYear, parseInt(toValue.value) + velocity);
			fromValue.value = toValue.value - fastForwarderDiff;
			var selected = $('#profession-selector').find(':selected').toArray().map(option => option.text);
			slider.noUiSlider.setHandle(0, fromValue.value);
			slider.noUiSlider.setHandle(1, toValue.value);
			updateMarkers(selected, fromValue.value, toValue.value);
			if(toValue.value == maximumYear) {
				clearInterval(fastForwarder);
				$("#play-icon").removeClass("fa-pause").addClass("fa-play")
				fastForwarder = null;
			}
		}, 100);
	} else {
		clearInterval(fastForwarder);
		$("#play-icon").removeClass("fa-pause").addClass("fa-play")
		fastForwarder = null;
	}
});


document.getElementById("lifespan-backward").addEventListener("click", function () {
	velocity = Math.max(1, velocity/2)
	document.getElementById("vel").innerHTML = "x " + velocity
})

document.getElementById("lifespan-forward").addEventListener("click", function () {
	velocity = Math.min(8192, velocity*2)
	document.getElementById("vel").innerHTML = "x " + velocity
})


fromValue.addEventListener('change', function (event) {
	slider.noUiSlider.setHandle(0, event.target.value);

	var selected = $('#profession-selector').find(':selected').toArray().map(option => option.text);
	updateMarkers(selected, fromValue.value, toValue.value);
});

toValue.addEventListener('change', function (event) {
	slider.noUiSlider.setHandle(1, event.target.value);

	var selected = $('#profession-selector').find(':selected').toArray().map(option => option.text);
	updateMarkers(selected, fromValue.value, toValue.value);
});
