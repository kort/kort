Ext.define('Kort.controller.Bugmap', {
    extend: 'Ext.app.Controller',

    config: {
        views: [
            'bugmap.NavigationView',
            'bugmap.Detail'
        ],
        refs: {
            mapCmp: '#bugmap',
            bugmapNavigationView: '#bugmapNavigationView'
        },
        control: {
            mapCmp: {
                maprender: 'onMapRender'
            }
        },

        map: null,
        ownPositionMarker: null,
        confirmTemplate: null,
        activeBug: null
    },

    onMapRender: function(cmp, map, tileLayer) {
        var me = this;
        me.setMap(map);

        // adding markers
        if(cmp.getGeo()) {
            me.addOwnPositionMarker(cmp, map);

            // add listener for locationupdate event of geolocation for setting marker position
            cmp.getGeo().addListener('locationupdate', function() {
                me.setOwnPositionMarkerPosition(new L.LatLng(this.getLatitude(), this.getLongitude()));
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

        icon = new L.Icon({
            iconUrl: './resources/images/marker_icons/own_position.png',
            iconSize: [iconWidth, iconHeight],
            iconAnchor: [(iconWidth/2), (iconHeight/2)]

        });
        ownPositionMarker = new L.Marker([cmp.getGeo().getLatitude(), cmp.getGeo().getLongitude()], {
            icon: icon,
            clickable: false
        });
        this.setOwnPositionMarker(ownPositionMarker);
        ownPositionMarker.addTo(map);
    },

    /**
     * Sets position of own position marker
     * @param latlng position of marker
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

        marker.bugdata = item;
        marker.on('click', me.onMarkerClick, me);
        marker.addTo(map);
    },
    
    onMarkerClick: function(e) {
        var tpl = this.getConfirmTemplate(),
            bugdata = e.target.bugdata;
        
        this.setActiveBug(bugdata)
        Ext.Msg.confirm(bugdata.get('title'), tpl.apply(bugdata.data), this.markerConfirmHandler, this);
    },
    
    markerConfirmHandler: function(buttonId, value, opt) {
        if(buttonId === 'yes') {
            this.getBugmapNavigationView().push(Ext.create('Kort.view.bugmap.Detail', {
                bugdata: this.getActiveBug()
            }));
        }
        
        this.setActiveBug(null);
    },

    getIcon: function(type) {
        var iconWidth = 32,
            iconHeight = 37,
            shadowWidth = 51,
            shadowHeight = 37,
            icon;

        icon = new L.Icon({
            iconUrl: './resources/images/marker_icons/' + type + '.png',
            iconSize: [iconWidth, iconHeight],
            iconAnchor: [(iconWidth/2), iconHeight],
            shadowUrl: './resources/images/marker_icons/shadow.png',
            shadowSize: [shadowWidth, shadowHeight],
            shadowAnchor: [(iconWidth/2), shadowHeight],
            popupAnchor: [0, -(2*iconHeight/3)]
        });
        return icon;
    },
    
    init: function() {
        this.setConfirmTemplate(new Ext.XTemplate(
            '<div class="confirm-content">',
                '<p>{description}</p>',
            '</div>'
        ));
    }
});