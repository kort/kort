Ext.define('CrimeFinder.controller.CrimeReports', {
	extend : 'Ext.app.Controller',
	uses: ['Utils.Map'],
    config: {
    	   refs: {
    	   	 'addressSearchField' 	: 'crimereport > toolbar > searchfield',
    	     'activityView' 		: 'crimereport',
    	     'dataView' 			: 'crimelist > dataview',
    	     'mapSearchButton' 	: 'crimereport > toolbar > button[text=Go]',
    	     'plotCurrentLocationButton' : 'crimereport > toolbar > button[action=plotcurrentlocation]',
      	 	 'crimeMap' : 'crimemap'
       },
       control: {
       	
       	    'addressSearchField' : {
            	blur : 'setLocation'
        	},
       	
			'mapSearchButton' : {
				tap : 'setLocation'
			},
			'plotCurrentLocationButton' : {
				tap: 'setCenter'
			},
		
			'crimereport button[action=togglemode]' : {
				tap: 'toggleMode'
			},
			
			dataview : {
				itemtap: 'showStreetView',
				activate: 'onShowCrimeList'
			}
       }
	},
	
	
	/*
	 *  Map Support Methods
	 */
	
	onShowCrimeList: function() {
	  // this.getDataView().setStore(Ext.getStore('CrimeReports'));	
	},
	
	showStreetView: function(dv, i, target, record, e, eOpts) {
	  var pos = new google.maps.LatLng(record.get('LAT'),record.get('LNG'));
	  Utils.Map.streetView( pos ,'streetview');
	},
	
	
	toggleMode: function(b,e) {
	  switch(b.getText()) {
	  	  case 'Detail' :
	  	    this.getActivityView().setActiveItem(1);
	  		b.setText('Chart');
	  	    break;
	  	  case 'Map' : 
	  	    this.getActivityView().setActiveItem(0);
	  		b.setText('Detail');
	  		break;
	  	  case 'Chart' : 
	  	    this.getActivityView().setActiveItem(2);
	  	    b.setText('Map');
	  		break;
	  }
	},
	
	setCurrentLocation: function(pos) {
		var map = this.getCrimeMap().getMap();
		this.loadCrimeData(pos, '', map);
	},
	
	setCenter: function(b,e) {	
		var map = Ext.ComponentQuery.query("map")[0].getMap();
		Utils.Map.centerMap(map,null,this.setCurrentLocation,this);
	},
	
	setLocation : function(b, e) {
		
		var me = this;
		var txtfield = this.getAddressSearchField();
		var s = txtfield.getValue() + " Washington, DC";
		
		var map = this.getCrimeMap().getMap();
		
		Utils.Map.geoCodeAddress(s, 
		 function(pos, address) {
			Utils.Map.plotLocation(map, pos, "You are here", "Your current position");
			Utils.Map.centerMap(map,pos);
			me.loadCrimeData(pos, address, map);
		 }
		);
		
	},

	loadCrimeData : function(pos, address, map) {

		var crimeStore = Ext.getStore('CrimeReports');
		Ext.Viewport.setMasked({ message: 'Loading...', xtype:'loadmask' });
		crimeStore.filter([{
			property : 'address',
			value : address
		}, {
			property : 'pos',
			value : pos.lat() + ',' + pos.lng()
		}, {
			property : 'radius',
			value : 0.1
		}]);
		
		crimeStore.load({
			scope : this,
			callback : function(records, operation) {	
				Ext.each(records, function(record) {
					Utils.Map.plotLocation(map, new google.maps.LatLng(record.get('LAT'), record.get('LNG')), record.get('OFFENSE'), record.get('OFFENSE') + '<br />' + record.get('REPORTDATE') + '<br />' + record.get('ADDRESS') + '<br />' + record.get('DESCRIPTION'));
				});
				Ext.Viewport.setMasked(false);
			}
		});
	}
});
