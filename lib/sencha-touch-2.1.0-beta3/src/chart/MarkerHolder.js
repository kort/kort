/**
 *
 */
Ext.define("Ext.chart.MarkerHolder", {
    extend: 'Ext.mixin.Mixin',

    mixinConfig: {
        id: 'markerHolder',
        hooks: {
            constructor: 'constructor',
            preRender: 'preRender'
        }
    },

    constructor: function () {
        this.boundMarkers = {};
    },

    /**
     *
     * @param name {String}
     * @param marker {Ext.chart.Markers}
     */
    bindMarker: function (name, marker) {
        if (marker) {
            if (!this.boundMarkers[name]) {
                this.boundMarkers[name] = [];
            }
            Ext.Array.include(this.boundMarkers[name], marker);
        }
    },

    getBoundMarker: function (name) {
        return this.boundMarkers[name];
    },

    preRender: function () {
        var boundMarkers = this.boundMarkers, boundMarkersItem,
            name, i, ln, id = this.getId();
        for (name in this.boundMarkers) {
            if (boundMarkers[name]) {
                for (boundMarkersItem = boundMarkers[name], i = 0, ln = boundMarkersItem.length; i < ln; i++) {
                    boundMarkersItem[i].clear(id);
                }
            }
        }
    },

    putMarker: function (name, markerAttr, index) {
        var boundMarkersItem, i, ln, id = this.getId();
        if (this.boundMarkers[name]) {
            for (boundMarkersItem = this.boundMarkers[name], i = 0, ln = boundMarkersItem.length; i < ln; i++) {
                boundMarkersItem[i].putMarkerFor(id, markerAttr, index);
            }
        }
    },

    getMarkerBBox: function (name, index, isWithoutTransform) {
        var boundMarkersItem, i, ln, id = this.getId();
        if (this.boundMarkers[name]) {
            for (boundMarkersItem = this.boundMarkers[name], i = 0, ln = boundMarkersItem.length; i < ln; i++) {
                return boundMarkersItem[i].getMarkerBBoxFor(id, index, isWithoutTransform);
            }
        }
    }
});