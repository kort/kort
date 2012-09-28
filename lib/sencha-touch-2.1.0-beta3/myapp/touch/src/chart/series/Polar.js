/**
 * Polar series.
 */
Ext.define('Ext.chart.series.Polar', {

    extend: 'Ext.chart.series.Series',

    config: {
        /**
         * @cfg {Number} rotation
         * The angle in degrees at which the first pie slice should start.
         */
        rotation: 0,

        /**
         * @cfg {Number} radius
         * The radius of the Pie chart. Set to `null` will fit the Pie chart to the boundary.
         */
        radius: null,

        /**
         * @cfg {Array} Center for the pie chart.
         */
        center: [0, 0],

        /**
         * @cfg {Number} offsetX
         * The x-offset of center of the slices related to the center of the boundary.
         */
        offsetX: 0,

        /**
         * @cfg {Number} offsetY
         * The y-offset of center of the slices related to the center of the boundary.
         */
        offsetY: 0,

        /**
         * @cfg {Boolean} showInLegend
         * Whether to add the pie chart elements as legend items. Default's false.
         */
        showInLegend: false
    },

    applyRotation: function (rotation) {
        var twoPie = Math.PI * 2;
        return (rotation % twoPie + twoPie) % twoPie;
    },

    updateRotation: function (rotation) {
        var sprites = this.getSprites(),
            i, ln;
        if (sprites[0]) {
            sprites[0].setAttributes({
                rotationRads: rotation
            });
        }
    }
});