
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
                    zoomControl: true,
                    noWrap: true,
                    zoomAnimation: true,
                    markerZoomAnimation: true,
                    maxBoundsViscosity: 0.8,
                    maxBounds: [
                    [89.9, 180.9],
                    [-89.9, -180.9]
                    ]
                }).setView([0,0]);


L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  subdomains: 'abcd',
  maxZoom: 19,
  bounds: [
                    [89.9, 180.9],
                    [-89.9, -180.9]
                    ]
  
}).addTo(mymap);

mymap.setMinZoom( mymap.getBoundsZoom([[50.9, 160.9],[-50.9, -160.9]]));

mymap.on('popupopen', function(e) {
    var px = mymap.project(e.target._popup._latlng); // find the pixel location on the map where the popup anchor is
    // console.log(e.target._popup._container.clientHeight)
    px.y -= e.target._popup._container.clientHeight; // find the height of the popup container, divide by 2, subtract from the Y axis of marker location
    mymap.panTo(mymap.unproject(px),{animate: true}); // pan to new center
    mymap.setView(e.target._popup._latlng, 3);
});

var myStyle = {
    "weight": 1,
    "opacity": 0.65

};


d3.csv("https://mbien-public.s3.eu-central-1.amazonaws.com/com-480/dataset.csv", function(data) {
		data.forEach(function(d, i) {
			
			var longitude = parseFloat(d.bplace_lon);
			var latitude = parseFloat(d.bplace_lat);
			var imgname = d.pic.split("/")
			var imgname = imgname[imgname.length - 1]
			
			var img="<img src='https://commons.wikimedia.org/w/thumb.php?width=64&f="+ imgname +"' loading='lazy' />"


			
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
			}).bindPopup('<b>Name:</b> '+d.name+'.<br><b>Year of Birth:</b> '+d.birthyear+'.<br><b>Place of Birth:</b> '+d.bplace_name+'.<br><b>Occupation:</b> '+d.occupation+'.<br><b>Year of Death:</b> '+d.deathyear+'.<br><b>Place of Death:</b> '+d.dplace_name+'.<br><img src="'+d.pic+'" width="'+img_w+'" height="'+img_h+'"/><br><b>About:</b> '+d.summary+'.<br>', {
				maxWidth : w*0.6,
				maxHeight : h*0.4,
			}).addTo(mymap);
		});
});

var sidebar = L.control.sidebar('sidebar').addTo(mymap);