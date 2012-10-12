Ext.define('Kort.controller.Map', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            mapCmp: '#leafletmap'
        },
        control: {
            mapCmp: {
                maprender: 'onMapRender'
            }
        },

        map: null,
        ownPositionMarker: null,
        popupTemplate: null
    },
    
    onMapRender: function(cmp, map, tileLayer) {
        var me = this;
        me.setMap(map);
        
        // adding markers
        if(cmp.getGeo()) {
            me.addOwnPositionMarker(cmp, map);
            
            // add listener for locationupdate event of geolocation for setting marker position
			cmp.getGeo().addListener('locationupdate', function() {
				me.setOwnPositionMarkerPosition(L.latLng(this.getLatitude(), this.getLongitude()));
			});
        }
        
        Ext.getStore('Bugs').each(function (item, index, length) {
            me.addMarker(map, item);
        });
    },
    
    addOwnPositionMarker: function(cmp, map) {
        var iconWidth = 20,
            iconHeight = 20,
            icon,
            ownPositionMarker;

        icon = L.icon({
            iconUrl: './resources/images/marker_icons/own_position.png',
            iconSize: [iconWidth, iconHeight],
            iconAnchor: [(iconWidth/2), (iconHeight/2)]

        });
        ownPositionMarker = L.marker([cmp.getGeo().getLatitude(), cmp.getGeo().getLongitude()], {
            icon: icon,
            clickable: false
        });
        this.setOwnPositionMarker(ownPositionMarker);
        ownPositionMarker.addTo(map);
    },
    
    /**
	 * Sets position of own position marker 
	 * 
	 * @param	latlng		position of marker
	 * 
	 * @private
	 */
	setOwnPositionMarkerPosition: function(latlng) {
		var ownPositionMarker = this.getOwnPositionMarker();
		if(ownPositionMarker) {
			ownPositionMarker.setLatLng(latlng);
		}
	},
    
    addMarker: function(map, item) {
        var me = this,
            icon,
            marker,
            tpl;
        
        icon = me.getIcon(item.get('type'));
        marker = L.marker([item.get('latitude'), item.get('longitude')], {
            icon: icon
        });
        
        tpl = this.getPopupTemplate();
        marker.bindPopup(tpl.apply(item.data));
        marker.addTo(map);
    },
    
    getIcon: function(type) {
        var iconWidth = 32,
            iconHeight = 37,
            shadowWidth = 51,
            shadowHeight = 37,
            icon;
        
        icon = L.icon({
            iconUrl: './resources/images/marker_icons/' + type + '.png',
            iconSize: [iconWidth, iconHeight],
            iconAnchor: [(iconWidth/2), iconHeight],
            shadowUrl: './resources/images/marker_icons/shadow.png',
            shadowSize: [shadowWidth, shadowHeight],
            shadowAnchor: [(iconWidth/2), shadowHeight],
            popupAnchor: [0, -(iconHeight/2)]
        });
        return icon;
    },
    
    init: function() {
        this.setPopupTemplate(new Ext.XTemplate(
            '<h1>{title}</h1>',
            '<p>{description}</p>'
        ));
    }
});