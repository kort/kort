Ext.define("Kort.controller.Main", {
	extend: "Ext.app.Controller",
	
	config: {
		views: [
			'Main'
		],
		refs: {
			mainTabPanel: '#mainTabPanel',
            map: '#leafletMap'
		},
		control: {
			mainTabPanel: {
				activeitemchange: 'onMainTabPanelActiveItemChange',
				initialize: 'onMainTabPanelInitialize'
			}
		},
		routes: {
			'list': 'showList',
			'map': 'showMap',
			'map/:lat/:lng': {
                action: 'showMap',
				// only allow floating numbers for latitude and longitude
                conditions: {
                    ':lat': "[0-9]+\.+[0-9]+",
					':lng': "[0-9]+\.+[0-9]+"
				}
			}
        }
	},
	
	/**
	 * Called when tabpanel is initialized
	 * @private
	 */
	onMainTabPanelInitialize: function(container, eOpts) {
		var viewName = this.getInitView();
		Ext.Logger.log('mainTabPanel initalized (viewName: ' + viewName + ', lat: ' + this.getInitLat() + ', lng: ' + this.getInitLng() + ')');
		
		// if initial view is set redirect to this view
		if (viewName) {
			Ext.Logger.log('redirect to ' + viewName);
			if (this.getInitLat()) {
				this.redirectTo(viewName + '/' + this.getInitLat() + '/' + this.getInitLng());
			} else {
				this.redirectTo(viewName);
			}
			this.setInitView(null);
		}
	},
	
	/**
	 * Called when active item of tabpanel changes
	 * @private
	 */
	onMainTabPanelActiveItemChange: function(container, value, oldValue, eOpts) {
		if (this.getRedirect()) {
			this.redirectTo(value.getUrl());
		}
	},
	
	/**
	 * Shows list view
	 * @private
	 */
	showList: function() {
		var viewName = 'list';
		this.saveInitView(viewName);
		this.switchView(viewName);
	},
	
	/**
	 * Shows map view
	 * 
	 * @param	lat		latitude for map center
	 * @param	lng		longitude for map center
	 * 
	 * @private
	 */
	showMap: function(lat,lng) {
		var viewName = 'map';
		this.saveInitView(viewName, lat, lng);
		this.centerMap(lat,lng);
		this.switchView(viewName);
	},
	
	/**
	 * Centers problem map to given position
	 * 
	 * @param	lat		latitude for map center
	 * @param	lng		longitude for map center
	 * 
	 * @private
	 */
	centerMap: function(lat,lng) {
		if(this.getMap() && lat && lng) {
			if(!this.getMap().getDisplayed()) {
				// Timeout to center map correctly on first call (wait till map is correctly rendered)
				Ext.defer(function() {
					this.centerMap(lat,lng);
				}, 500, this);
			} else {
				this.getMap().setMapCenter(L.latLng(this.getInitLat(), this.getInitLng()));

				this.setInitLat(null);
				this.setInitLng(null);
			}
		}
	},
	
	/**
	 * Saves the init state
	 * 
	 * @param	viewName	name of view to show
	 * @param	lat			latitude for map center
	 * @param	lng			longitude for map center
	 * 
	 * @private
	 */
	saveInitView: function(viewName, lat, lng) {
		if (lat) {
			this.setCenterToOwnPosition(false);
		}
		this.setInitView(viewName);
		this.setInitLat(lat);
		this.setInitLng(lng);
	},
	
	/**
	 * Switches view to given viewname
	 * 
	 * @param	viewName	name of view to show
	 * 
	 * @private
	 */
	switchView: function(viewName) {
		if (this.getMainTabPanel()) {
			var viewNr = this.getViewNr(viewName);
			this.setRedirect(false);
			this.getMainTabPanel().setActiveItem(viewNr);
			this.setRedirect(true);
		}
	},
	
	// -------------------------------------------------------
    // Base Class functions
	// -------------------------------------------------------
	init: function () {
		var me = this;
		me.initView = null;
		me.initLat = null;
		me.initLng = null;
		me.redirect = true;
		me.centerToOwnPosition = true;
	},
	
	// returns position of each view in tabpanel
	getViewNr: function(viewName) {
		var views = {
			'map': 0,
			'list': 1
		};
		return views[viewName];
	},
	
	getInitView: function() {
		return this.initView;
	},
	setInitView: function(initView) {
		this.initView = initView;
	},
	getInitLat: function() {
		return this.initLat;
	},
	setInitLat: function(lat) {
		this.initLat = lat;
	},
	getInitLng: function() {
		return this.initLng;
	},
	setInitLng: function(lng) {
		this.initLng = lng;
	},
	getRedirect: function() {
		return this.redirect;
	},
	setRedirect: function(redirect) {
		this.redirect = redirect;
	},
	getCenterToOwnPosition: function() {
		return this.centerToOwnPosition;
	},
	setCenterToOwnPosition: function(centerToOwnPosition) {
		this.centerToOwnPosition = centerToOwnPosition;
	}
});