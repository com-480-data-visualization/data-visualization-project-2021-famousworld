
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
    mymap.setView(mymap.unproject(px), 3);
    
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

		if(!d.active && activate) {
			mymap.addLayer(d.marker);
			d.active = true;
		} else if(d.active && !activate) {
			mymap.removeLayer(d.marker);
			d.active = false;
		}
	});
}

var popupTemplate = `
<div class="popup-container">
	<div class="popup-image">
		<img src="%PICURL%" width="%PICW%" height="%PICH%"/>
	</div>
	<div class="popup-info">
		<p><b>Name: </b> %NAME%.</p>
		<p><b>Year of Birth:</b> %YOB%.</p>
		<p><b>Place of Birth:</b> %POB%.</p>
		<p><b>Occupation:</b> %OCC%.</p>
		<p><b>Year of Death:</b> %YOD%.</p>
		<p><b>Place of Death:</b> %POD%.</p>
	</div>
	<div class="popup-summary">
		<p><b>About:</b> %SUM%.</p>
	</div>
</div>
`;


const data = d3.csv("https://mbien-public.s3.eu-central-1.amazonaws.com/com-480/dataset.csv");
data.then(function(data) {

	var professionOptions = [];

	data.forEach(function(d, i) {
		
		var longitude = parseFloat(d.bplace_lon);
		var latitude = parseFloat(d.bplace_lat);
		var imgname = d.pic.split("/")
		var imgname = imgname[imgname.length - 1]
		
		var img="<img src='https://commons.wikimedia.org/w/thumb.php?width=64&f="+ imgname +"' loading='lazy' />"

		var popupText = popupTemplate.replace("%NAME%", d.name)
									 .replace("%YOB%", d.birthyear)
									 .replace("%POB%", d.bplace_name)
									 .replace("%OCC%", d.occupation)
									 .replace("%YOD%", d.deathyear)
									 .replace("%POD%", d.dplace_name)
									 .replace("%PICURL%", d.pic)
									 .replace("%PICW%", img_w)
									 .replace("%PICH%", img_h)
									 .replace("%SUM%", d.summary)
		
		
		
		popupContent = document.createElement("iframe");
		popupContent.style.overflow="hidden"
		popupContent.name='frame-'+d.id
		popupContent.src = "popup.html";
		popupContent.width=w*0.6
		popupContent.height=h*0.6
		popupContent.id=d.id
		
		class_img='image-icon_d'
		// '<iframe name="frame-'+d.id+'" src="></iframe>'
		if(d.birthyear && !d.deathyear){
			class_img='image-icon_a'
		}

		var marker = L.marker(L.latLng(latitude,longitude), {
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


$('#profession-selector').on('select2:select select2:unselect', function (e) {
    var selected = $('#profession-selector').find(':selected').toArray().map(option => option.text)
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

