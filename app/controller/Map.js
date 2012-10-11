Ext.define('Kort.controller.Map', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            mapCmp: '#openlayersmap'
        },
        control: {
            mapCmp: {
                maprender: 'onMapRender'
            }
        },

        map: null,
        vectorLayer: null,
        features: [],
        selectFeatureControl: null
    },
    
    onMapRender: function(component, map, layer) {
        var me = this;
        me.setMap(map);
        var vectorLayer = this.createVectorLayer(map);

        // adding markers to vector layer
        var ownPositionMarkerStyle = {
            externalGraphic: './resources/images/marker_icons/own_position.png',
            graphicWidth: 20,
            graphicHeight: 20
        };
        var ownPositionMarkerPoint = new OpenLayers.Geometry.Point(component.getGeo().getLongitude(), component.getGeo().getLatitude());
        me.addMarker(ownPositionMarkerPoint, null, ownPositionMarkerStyle);
        
        Ext.getStore('Bugs').each(function (item, index, length) {
            var markerPoint = new OpenLayers.Geometry.Point(item.get('lon'), item.get('lat'));
            me.addMarker(markerPoint, null, me.getMarkerStyle(item.get('type')));
        });
        
        // adding linestring
        var point1 = new OpenLayers.Geometry.Point(component.getGeo().getLongitude(), component.getGeo().getLatitude());
        var point2 = new OpenLayers.Geometry.Point(component.getGeo().getLongitude() + 1, component.getGeo().getLatitude() + 1);

        var lineStyle = {
            strokeColor: '#0000ff',
            strokeOpacity: 0.5,
            strokeWidth: 5
        };

        me.addLineString(point1, point2, null, lineStyle);

        // popup
        var selectFeatureControl = new OpenLayers.Control.SelectFeature(vectorLayer, {
            autoActivate: true
        });
        me.setSelectFeatureControl(selectFeatureControl);
        
        map.addControl(selectFeatureControl);
    },

    onFeatureSelected: function(scope, event, map) {
        /*
        // getting click position
        var pixel = scope.getSelectControl().handlers.feature.evt.xy;
        var location = map.getLonLatFromPixel(pixel);
        */
        var feature = event.feature,
            position = feature.geometry.getBounds().getCenterLonLat(),
            content = feature.id;
            
        var messagebox = Ext.Msg.confirm(feature.id, "Willst du diese Rose haben?", this.confirmMessageHandler, this);
        /*var popup = new OpenLayers.Popup.FramedCloud('popup',
            position,
            null,
            content,
            null,
            true,
            null
        );
        popup.autoSize = true;
        popup.maxSize = new OpenLayers.Size(400,800);
        popup.fixedRelativePosition = true;
        feature.popup = popup;
        map.addPopup(popup);*/
    },

    onFeatureUnselected: function(scope, event, map) {
        /*var feature = event.feature;
        map.removePopup(feature.popup);
        feature.popup.destroy();
        feature.popup = null;*/
    },
    
    confirmMessageHandler: function(buttonId, value) {
        if(buttonId != 'yes') {
            this.getSelectFeatureControl().unselectAll();
        }
    },

    createVectorLayer: function(map) {
        var me = this;
        var vectorLayer = new OpenLayers.Layer.Vector("Vector Layer", {
            eventListeners: {
                featureselected: function(event) {
                    me.onFeatureSelected(me, event, map);
                },
                featureunselected: function(event) {
                    me.onFeatureUnselected(me, event, map);
                }
            }
        });

        this.setVectorLayer(vectorLayer);
        map.addLayer(vectorLayer);
        return vectorLayer;
    },

    addMarker: function(point, attributes, style) {
        this.getMapCmp().transformLonLatObject(point);
        var markerFeature = new OpenLayers.Feature.Vector(point, attributes, style);
        this.getFeatures().push(markerFeature);
        this.getVectorLayer().addFeatures(markerFeature);
    },

    addLineString: function(startPoint, endPoint, attributes, style) {
        this.getMapCmp().transformLonLatObject(startPoint);
        this.getMapCmp().transformLonLatObject(endPoint);
        var lineString = new OpenLayers.Geometry.LineString([startPoint, endPoint]);
        var lineFeature = new OpenLayers.Feature.Vector(lineString, attributes, style);
        this.getFeatures().push(lineFeature);
        this.getVectorLayer().addFeatures(lineFeature);
    },
    
    getMarkerStyle: function(type) {
        var markerWidth = 32;
        var markerHeight = 37;
        var shadowWidth = 51;
        var shadowHeight = 37;
        var style = {
            externalGraphic: './resources/images/marker_icons/' + type + '.png',
            graphicWidth: markerWidth,
            graphicHeight: markerHeight,
            graphicYOffset: -markerHeight,
            backgroundGraphic: './resources/images/marker_icons/shadow.png',
            backgroundWidth: shadowWidth,
            backgroundHeight: shadowHeight,
            backgroundXOffset: -(markerWidth/2),
            backgroundYOffset: -shadowHeight
        };
        return style;
    }
});