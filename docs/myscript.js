
window.onscroll = function() {myFunction()};

// Get the navbar
var navbar = document.getElementById("navbar");

// Get the offset position of the navbar
var sticky = navbar.offsetTop;

// Add the sticky class to the navbar when you reach its scroll position. Remove "sticky" when you leave the scroll position
function myFunction() {
  if (window.pageYOffset >= sticky) {
    navbar.classList.add("sticky")
  } else {
    navbar.classList.remove("sticky");
  }
}

var w = $(window).width();
var h = $(window).height();

var img_w = $(window).width()/8.0;
var img_h = $(window).height()/4.0;
// variables for catching min and max zoom factors
var minZoom;
var maxZoom;
var imgs = ["https://cdn0.iconfinder.com/data/icons/flat-round-system/512/android-128.png", "https://cdn1.iconfinder.com/data/icons/user-pictures/100/male3-128.png"]
var radius = 14



function pop(circ_context, id){
	var active   = circ_context.active ? false : true ;
 	circ_context.active=active
 	if(active){
	 	d3.select( circ_context )
          .transition()
          .attr("r", radius*1.5)
          
        
        var defid="#image_id"+circ_context.getAttribute("cval")
        // overlay.classList.add('active');
		d3.select(defid)
        	.transition()
        	.attr("width",radius*3)
        	.attr("height",radius*3)
     }
     else{
     	d3.select( circ_context )
          .transition()
          .attr("r", radius)
        var defid="#image_id"+circ_context.getAttribute("cval")
        d3.select(defid)
        	.transition()
        	.attr("width",radius*2)
        	.attr("height",radius*2)
	            // overlay.classList.remove('active');
  	}
  }
var overlayon=false
var mymap = L.map('map-holder', {
                    zoom: 2,
                    maxZoom: 21,
                    scrollWheelZoom: true,
                    maxBounds: [
                    [89.9, 160.9],
                    [-89.9, -160.9]
                    ],
                    zoomControl: false,
                    noWrap: true,
                    zoomAnimation: true,
                    markerZoomAnimation: true,
                }).setView([0, 0]);
// L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
//     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
//     maxZoom: 18,
//     id: 'mapbox/streets-v11',
//     tileSize: 512,
//     zoomOffset: -1,

//     accessToken: 'pk.eyJ1IjoiYWJwb2IiLCJhIjoiY2tvMXdyeDFrMGN0dzJ3bHBucDk5b2RjayJ9.38iB0G3PP9BOURfBcOUEGQ'
// }).addTo(mymap);

var myStyle = {
    "weight": 1,
    "opacity": 0.65
};

d3.json("https://mbien-public.s3.eu-central-1.amazonaws.com/com-480/custom.geo.json", function(json) {
		L.geoJSON(json, {
    style: myStyle
	}).addTo(mymap);
});

d3.csv("https://mbien-public.s3.eu-central-1.amazonaws.com/com-480/dataset.csv", function(data) {
		data.forEach(function(d, i) {
			
			var longitude = parseFloat(d.bplace_lon);
			var latitude = parseFloat(d.bplace_lat);
			// console.log(d.pic)

			// var greenIcon = L.icon({
			//     iconUrl: d.pic,
			//     className: 'image-icon',
			//     iconSize:     [40, 40], // size of the icon
			//     iconAnchor:   [20, 20], // point of the icon which will correspond to marker's location,  // the same for the shadow
			// });
			// var img = new Image();
			// img.src = d.base64_image;
			// var img="<img src='"+d.pic+"' />"
			var img="<img src='"+d.pic+"' />"
			
			L.marker([latitude,longitude], {icon: L.divIcon({
		        html: img,
		        // Specify a class name we can refer to in CSS.
		        className: 'image-icon',
		        // Set a markers width and height.
		        iconSize: [20, 20],
		        iconAnchor: [30, 30],
		        }),
				title: d.name,
			}).bindPopup('<b>Name:</b> '+d.name+'.<br><b>Year of Birth:</b> '+d.birthyear+'.<br><b>Place of Birth:</b> '+d.bplace_name+'.<br><b>Occupation:</b> '+d.occupation+'.<br><b>Year of Death:</b> '+d.deathyear+'.<br><b>Place of Death:</b> '+d.dplace_name+'.<br><img src="'+d.pic+'" width="'+img_w+'" height="'+img_h+'"/><br><b>About:</b> '+d.summary+'.<br>', {
				maxWidth : w/2,
			}).addTo(mymap);
		});
});

