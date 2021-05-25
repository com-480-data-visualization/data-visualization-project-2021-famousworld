
// Get the navbar
//var navbar = document.getElementById("navbar");


var w = $(window).width();
var h = $(window).height();

var img_w = $(window).width()/8.0;
var img_h = $(window).height()/4.0;
var radius = 14



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
                }).setView([0,0]);


L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  subdomains: 'abcd',
  maxZoom: 19,
  bounds: [
                    [89.9, 220.9],
                    [-89.9, -220.9]
                    ]
  
}).addTo(mymap);

mymap.setMinZoom( mymap.getBoundsZoom([[50.9, 160.9],[-50.9, -160.9]]));

var curr_value=null;
var curr_marker=null;



$(window).resize(function() {
  // console.log(document.body.clientWidth);
  if(curr_value){
  		var frame=document.getElementById(curr_value.id);
		var wn = $(window).width();
		var hn = $(window).height();
	  	frame.width=wn*0.6;
	  	frame.height=hn*0.6;

	  	// var px = mymap.project(curr_marker._latlng); // find the pixel location on the map where the popup anchor is
   
	   //  px.y -= curr_marker._container.clientHeight/3; // find the height of the popup container, divide by 2, subtract from the Y axis of marker location
	   //  mymap.panTo(mymap.unproject(px),{animate: true}); // pan to new center
	   //  mymap.setView(mymap.unproject(px), 3);
  }
});

mymap.on('popupopen', function(e) {
	// curr_value=null;

    var px = mymap.project(e.target._popup._latlng); // find the pixel location on the map where the popup anchor is
   
    px.y -= e.target._popup._container.clientHeight/3; // find the height of the popup container, divide by 2, subtract from the Y axis of marker location
    mymap.panTo(mymap.unproject(px),{animate: true}); // pan to new center
    //mymap.setView(mymap.unproject(px), 3);
    
    curr_value=e.target._popup._source.options.data_object;
    curr_marker=e.target._popup;

});

function setUpFrame() { 
	// console.log(curr_value);
    var frame = window.frames['frame-'+curr_value.id];
    frame.populate(curr_value);
}

var myStyle = {
    "weight": 1,
    "opacity": 0.65

};


var markers = []

// This function is in charge of filtering the markers as we wish
// input: list of professions and 
function updateMarkers(professionConstrain, birthFrom, birthTo) {
	maxActive = 50;
	currActive = 0;
	markers.forEach(function(d, i){
		var activate = true;
		// Profession filter
		if(professionConstrain.length>0) {
			if(!professionConstrain.includes(d.data.occupation)) {
				activate = false;
			}
		}

		//Birth from filter
		if(birthFrom != null) {
			if(parseInt(d.data.birthyear) < birthFrom) {
				activate = false;
			}
		}

		if(birthTo != null) {
			if(parseInt(d.data.birthyear) > birthTo) {
				activate = false;
			}
		}

		//Deactivate if not on the visible part of map
		if(!mymap.getBounds().contains(d.marker.getLatLng())) {
			activate = false;
		}

		// Array is sorted by decreasing HPI, so we just have to count
		// the activated markers to get region top fames.
		if (activate) {
			currActive = currActive+1;
			if(currActive > maxActive) {
				activate = false;
			}
		}

		if(!d.active && activate) {
			mymap.addLayer(d.marker);
			d.active = true;
		} else if(d.active && !activate) {
			mymap.removeLayer(d.marker);
			d.active = false;
		}
	});
}

const data = d3.csv("https://mbien-public.s3.eu-central-1.amazonaws.com/com-480/dataset.csv");
//const data = d3.csv("dataset.csv");
data.then(function(data) {

	var professionOptions = [];

	data.forEach(function(d, i) {
		
		var longitude = parseFloat(d.bplace_lon) + Math.random()*0.1; //Counter the exact same position on map eg. Paris
		var latitude = parseFloat(d.bplace_lat) + Math.random()*0.1;
		var imgname = d.pic.split("/")
		var imgname = imgname[imgname.length - 1]
		
		var img="<img src='https://commons.wikimedia.org/w/thumb.php?width=64&f="+ imgname +"' loading='lazy' />"
		
		popupContent = document.createElement("iframe");
		popupContent.name='frame-'+d.id
		popupContent.src = "popup.html";
		popupContent.width=w*0.6
		popupContent.height=h*0.6
		popupContent.id=d.id
		
		// '<iframe name="frame-'+d.id+'" src="></iframe>'

		var marker = L.marker(L.latLng(latitude,longitude), {
			icon: L.divIcon({
				html: img,
				// Specify a class name we can refer to in CSS.
				className: 'image-icon',
				// Set a markers width and height.
				iconSize: [20, 20],
				iconAnchor: [30, 30],
			}),
			title: d.name,
			data_object: d,
		}).bindPopup(popupContent, {//name="frame-'+d.id+'"  name="frame-pop"
			// minWidth: w*0.6,
			// maxWidth: w*0.7,
			// maxHeight: h*0.7,
			// minHeight: h*0.6	
			 maxWidth: "auto"
		})
		
		markers.push({
			'data': d,
			'marker': marker,
			'active': false
		})

		professionOptions.push(d.occupation);
	});

	//Load the profession data into selector
	var professionOptionsUnique = professionOptions.filter(function(value, index, self) {
		return self.indexOf(value) === index;
	});
	
	var professionOptionsReady = professionOptionsUnique.map(function(value, index, self) {
		return {id: index, text: value};
	});
	
	$('#profession-selector').select2({
		placeholder: 'Select an option',
		width: 'resolve',
		data: professionOptionsReady,
		dropdownParent: $(".sidebar-content")
	});

	updateMarkers([], -3500, 2021);
});

var sidebar = L.control.sidebar('sidebar').addTo(mymap);
var zoomControl = L.control.zoom({ position: 'topright' }).addTo(mymap);

var fromValue = document.getElementById('from');
var toValue = document.getElementById('to');

mymap.on("zoomstart", function () { 
	let selected = $('#profession-selector').find(':selected').toArray().map(option => option.text)
	updateMarkers(selected, fromValue.value, toValue.value); 
});
mymap.on("moveend", function () {
	let selected = $('#profession-selector').find(':selected').toArray().map(option => option.text)
	updateMarkers(selected, fromValue.value, toValue.value); 
});

$('#profession-selector').on('select2:select select2:unselect', function (e) {
    let selected = $('#profession-selector').find(':selected').toArray().map(option => option.text)
    updateMarkers(selected, fromValue.value, toValue.value);
});

var slider = document.getElementById('lifespan-slider');
noUiSlider.create(slider, {
    start: [-3500, 2021],
    connect: true,
    range: {
        'min': -3500,
        'max': 2021
    },
	format: wNumb({
        decimals: 0
    })
});

var fastForwarder = null;
var fastForwarderDiff = 0;
document.getElementById("lifespan-play").addEventListener("click", function(){
	if(fastForwarder==null) {
		fastForwarderDiff = parseInt(toValue.value) - parseInt(fromValue.value);
		fastForwarder = setInterval(function (){
			toValue.value = Math.min(2021, parseInt(toValue.value) + 10);
			fromValue.value = toValue.value - fastForwarderDiff;
			var selected = $('#profession-selector').find(':selected').toArray().map(option => option.text);
			slider.noUiSlider.setHandle(0, fromValue.value);
			slider.noUiSlider.setHandle(1, toValue.value);
			updateMarkers(selected, fromValue.value, toValue.value);
		}, 500);
	}
});

document.getElementById("lifespan-pause").addEventListener("click", function(){
	if(fastForwarder!=null) {
		clearInterval(fastForwarder);
		fastForwarder = null;
	}
});


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

slider.noUiSlider.on('update', function (values, handle) {
    if (handle) {
        toValue.value = values[handle];
    } else {
        fromValue.value = values[handle];
    }

	var selected = $('#profession-selector').find(':selected').toArray().map(option => option.text);
	updateMarkers(selected, fromValue.value, toValue.value);
});

