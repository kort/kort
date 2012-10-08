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
        selectControl: null
    },
    
    onMapRender: function(component, map, layer) {
        var me = this;
        me.setMap(map);
        var vectorLayer = this.createVectorLayer(map);

        // adding marker to vector layer
        var markerPoint = new OpenLayers.Geometry.Point(component.getGeo().getLongitude(), component.getGeo().getLatitude());

        var iconWidth = 21;
        var iconHeight = 25;

        var iconStyle = {
            externalGraphic: "http://www.openlayers.org/dev/img/marker.png",
            graphicWidth: iconWidth,
            graphicHeight: iconHeight,
            graphicYOffset: -(iconHeight)
        };

        me.addMarker(markerPoint, null, iconStyle);

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
        var selectControl = new OpenLayers.Control.SelectFeature(vectorLayer, {
            autoActivate: true
        });
        me.setSelectControl(selectControl);
        map.addControl(selectControl);
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
        
        var popup = new OpenLayers.Popup.FramedCloud('popup',
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
        map.addPopup(popup);
    },

    onFeatureUnselected: function(scope, event, map) {
        var feature = event.feature;
        map.removePopup(feature.popup);
        feature.popup.destroy();
        feature.popup = null;
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
        var iconFeature = new OpenLayers.Feature.Vector(point, attributes, style);
        this.getFeatures().push(iconFeature);
        this.getVectorLayer().addFeatures(iconFeature);
    },

    addLineString: function(startPoint, endPoint, attributes, style) {
        this.getMapCmp().transformLonLatObject(startPoint);
        this.getMapCmp().transformLonLatObject(endPoint);
        var lineString = new OpenLayers.Geometry.LineString([startPoint, endPoint]);
        var lineFeature = new OpenLayers.Feature.Vector(lineString, attributes, style);
        this.getFeatures().push(lineFeature);
        this.getVectorLayer().addFeatures(lineFeature);
    }
});