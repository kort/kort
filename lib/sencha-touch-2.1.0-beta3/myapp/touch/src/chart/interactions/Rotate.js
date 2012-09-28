/**
 * TODO: Documention
 */
Ext.define('Ext.chart.interactions.Rotate', {

    extend: 'Ext.chart.interactions.Abstract',

    type: 'rotate',

    alias: 'interaction.rotate',

    config: {
        /**
         * @cfg {String} gesture
         * Defines the gesture type that will be used to rotate the chart. Currently only
         * supports `pinch` for two-finger rotation and `drag` for single-finger rotation.
         */
        gesture: 'rotate'
    },

    oldRotations: null,

    getGestures: function () {
        var gestures = {};
        gestures['rotate'] = 'onRotate';
        gestures['rotateend'] = 'onRotate';
        gestures['dragstart'] = 'onGestureStart';
        gestures['drag'] = 'onGesture';
        gestures['dragend'] = 'onGesture';
        return gestures;
    },

    getAngle: function (e) {
        var me = this,
            chart = me.getChart(),
            xy = chart.element.getXY(),
            center = chart.getCenter();
        return Math.atan2(e.pageY - xy[1] - center[1], e.pageX - xy[0] - center[0]);
    },

    onGestureStart: function (e) {
        this.angle = this.getAngle(e);
        this.oldRotations = null;
    },

    onGesture: function (e) {
        var me = this,
            chart = me.getChart(),
            angle = this.getAngle(e),
            series = chart.getSeries(), seriesItem,
            oldRotations = this.oldRotations,
            i, ln;
        if (!oldRotations) {
            oldRotations = this.oldRotations = {};
            for (i = 0, ln = series.length; i < ln; i++) {
                seriesItem = series[i];
                oldRotations[seriesItem.getId()] = seriesItem.getRotation();
            }
        }
        for (i = 0, ln = series.length; i < ln; i++) {
            seriesItem = series[i];
            seriesItem.setRotation(oldRotations[seriesItem.getId()] + angle - me.angle);
        }
        me.sync();
    },

    onRotate: function (e) {

    }
});
