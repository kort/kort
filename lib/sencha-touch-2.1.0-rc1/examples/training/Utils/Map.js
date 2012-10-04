Ext.define("Utils.Map", {
	statics : {
		echo : function() {
			console.log(arguments);
		},
		centerMap : function(gMap, loc, callback, scope) {
			if(loc != null) {
				gMap.setCenter(loc);
				Utils.Map.plotLocation(gMap,loc,"Current Position","Your current position");
			} else {
				navigator.geolocation.getCurrentPosition(function(position) {
					var initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
					gMap.setCenter(initialLocation);
					Utils.Map.plotLocation(gMap,initialLocation,"Current Position","");
					callback.call(scope,initialLocation);
				}, function() {
					Ext.Msg.alert("Error", "Could not get your position.");
				});
			}
		},
		geoCodeAddress : function(address, callback) {

			var geocoder = new google.maps.Geocoder();

			geocoder.geocode({
				'address' : address
			}, function(results, status) {
				if(status != google.maps.GeocoderStatus.OK) {
					Ext.Msg.alert("Address not found", status);
				} else {
					callback(results[0].geometry.location, results[0].formatted_address);
				}
			});
		},
		plotLocation : function(objMap, pos, title, content) {
		  
			var marker = new google.maps.Marker({
				position : pos,
				map : objMap,
				title : title
			});

			if( typeof content == 'string' && content != '') {
				var infoWindow = new google.maps.InfoWindow({
					content : content
				});
				google.maps.event.addListener(marker, 'click', function() {
					infoWindow.open(objMap, marker);
				})
			} else if( typeof content == 'object') {
				google.maps.event.addListener(marker, 'click', content)
			}
		},
		getDirections : function(origin, destination, travelMode, callback) {

			var travelModes = [google.maps.TravelMode.DRIVING, google.maps.TravelMode.WALKING, google.maps.TravelMode.BICYCLING];

			var directionsService = new google.maps.DirectionsService();
			var request = {
				origin : origin,
				destination : destination,
				travelMode : travelModes[travelMode]
			};
			directionsService.route(request, function(response, status) {
				if(status == google.maps.DirectionsStatus.OK) {
					callback(response);
				}
			});
		},
		streetView : function(pos, domID) {
			var panoramaOptions = {
				position : pos,
				pov : {
					heading : 34,
					pitch : 10,
					zoom : 1
				}
			};
			var panorama = new google.maps.StreetViewPanorama(document.getElementById(domID), panoramaOptions);
		}
	}
});
