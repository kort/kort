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

        map: null
    },
    
    onMapRender: function(cmp, map, tileLayer) {
        var me = this;
        me.setMap(map);
        
        // adding markers
        if(cmp.getGeo()) {
            me.addOwnPositionMarker(cmp, map);
        }
        
        Ext.getStore('Bugs').each(function (item, index, length) {
            me.addMarker(map, item.get('latitude'), item.get('longitude'), item.get('type'));
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
        ownPositionMarker.addTo(map);
    },
    
    addMarker: function(map, lat, lng, type) {
        var icon,
            marker,
            me = this;
        
        icon = me.getIcon(type);
        marker = L.marker([lat, lng], {
            icon: icon
        });
        marker.on('click', me.onMarkerClick, me);
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
            shadowAnchor: [(iconWidth/2), shadowHeight]
        });
        return icon;
    },
    
    onMarkerClick: function(e) {
        var messagebox = Ext.Msg.confirm("title", "Willst du diese Rose haben?", this.confirmMessageHandler, this);
    },
    
    confirmMessageHandler: function(buttonId, value) {
        if(buttonId !== 'yes') {
            console.log('no');
        } else {
            console.log('yes');
        }
    }
});