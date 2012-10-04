Ext.define("CrimeFinder.view.crimereport.Map", {
    extend: 'Ext.Map',
    xtype: 'crimemap',
    
   config: {
   	useCurrentLocation: false,
   	mapOptions: {
   			center : new google.maps.LatLng(38.909085, -77.036777),
			zoom : 16,
			mapTypeId : google.maps.MapTypeId.ROADMAP,
			navigationControl : true,
			navigationControlOptions : {
				style : google.maps.NavigationControlStyle.DEFAULT
			}
   	}
   }
});
