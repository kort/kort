/**
 * @class Ext.chart.series.Radar
 * @extends Ext.chart.series.Series
 *
 * Creates a Radar Chart. A Radar Chart is a useful visualization technique for comparing different quantitative values for
 * a constrained number of categories.
 * As with all other series, the Radar series must be appended in the *series* Chart array configuration. See the Chart
 * documentation for more information. A typical configuration object for the radar series could be:
 *
 * {@img Ext.chart.series.Radar/Ext.chart.series.Radar.png Ext.chart.series.Radar chart series}
 *
 *     var store = new Ext.data.JsonStore({
 *         fields: ['name', 'data1', 'data2', 'data3', 'data4', 'data5'],
 *         data: [
 *             {'name':'metric one', 'data1':10, 'data2':12, 'data3':14, 'data4':8, 'data5':13},
 *             {'name':'metric two', 'data1':7, 'data2':8, 'data3':16, 'data4':10, 'data5':3},
 *             {'name':'metric three', 'data1':5, 'data2':2, 'data3':14, 'data4':12, 'data5':7},
 *             {'name':'metric four', 'data1':2, 'data2':14, 'data3':6, 'data4':1, 'data5':23},
 *             {'name':'metric five', 'data1':27, 'data2':38, 'data3':36, 'data4':13, 'data5':33}
 *         ]
 *     });
 *
 *     new Ext.chart.AbstractChart({
 *         renderTo: Ext.getBody(),
 *         width: 500,
 *         height: 300,
 *         animate: true,
 *         theme:'Category2',
 *         store: store,
 *         axes: [{
 *             type: 'Radial',
 *             position: 'radial',
 *             label: {
 *                 display: true
 *             }
 *         }],
 *         series: [{
 *             type: 'radar',
 *             xField: 'name',
 *             yField: 'data3',
 *             showInLegend: true,
 *             marker: {
 *                 radius: 5,
 *                 size: 5
 *             },
 *             style: {
 *                 'lineWidth': 2,
 *                 fill: 'none'
 *             }
 *         },{
 *             type: 'radar',
 *             xField: 'name',
 *             yField: 'data2',
 *             showInLegend: true,
 *             marker: {
 *                 radius: 5,
 *                 size: 5
 *             },
 *             style: {
 *                 'lineWidth': 2,
 *                 fill: 'none'
 *             }
 *         },{
 *             type: 'radar',
 *             xField: 'name',
 *             yField: 'data5',
 *             showInLegend: true,
 *             marker: {
 *                 radius: 5,
 *                 size: 5
 *             },
 *             style: {
 *                 'lineWidth': 2,
 *                 fill: 'none'
 *             }
 *         }]
 *     });
 *
 *
 */
Ext.define('Ext.chart.series.Radar', {
    extend: 'Ext.chart.series.Polar',
    type: "radar",
    seriesType: 'radar',
    alias: 'series.radar',
    requires: ['Ext.chart.series.Cartesian', 'Ext.chart.series.sprite.Radar'],
    /**
     * @cfg {Object} style
     * An object containing styles for overriding series styles from theming.
     */

    config: {

    },

    updateAngularAxis: function (axis) {
        axis.processData(this);
    },

    updateRadialAxis: function (axis) {
        axis.processData(this);
    },

    coordinateX: function () {
        return this.coordinate('X', 0, 2);
    },

    coordinateY: function () {
        return this.coordinate('Y', 1, 2);
    },

    updateCenter: function (center) {
        this.setStyle({
            translationX: center[0] + this.getOffsetX(),
            translationY: center[1] + this.getOffsetY()
        });
        this.doUpdateStyles();
    },

    updateRadius: function (radius) {
        this.setStyle({
            endRho: radius
        });
        this.doUpdateStyles();
    },

    updateRotation: function (rotation) {
        this.setStyle({
            rotationRads: rotation
        });
        this.doUpdateStyles();
    },

    updateTotalAngle: function (totalAngle) {
        this.processData();
    },

    getItemForPoint: function (x, y) {
        var me = this,
            sprite = me.sprites && me.sprites[0],
            attr = sprite.attr,
            dataX = attr.dataX,
            dataY = attr.dataY,
            centerX = attr.centerX,
            centerY = attr.centerY,
            dataRange = attr.dataRange,
            minX = dataRange[0],
            maxX = dataRange[2],
            maxY = dataRange[3],
            endRho = attr.endRho,
            startRho = attr.startRho,
            baseRotation = attr.baseRotation,
            i, length = dataX.length,
            store = me.getStore(),
            marker = me.getMarker(),
            item, th, r;

        if (sprite && marker) {
            for (i = 0; i < length; i++) {
                th = (dataX[i] - minX) / (maxX - minX + 1) * 2 * Math.PI + baseRotation;
                r = dataY[i] / maxY * (endRho - startRho) + startRho;
                if (Math.abs(centerX + Math.cos(th) * r - x) < 22 && Math.abs(centerY + Math.sin(th) * r - y) < 22) {
                    item = {
                        series: this,
                        sprite: sprite,
                        index: i,
                        record: store.getData().items[i],
                        field: store.getFields().items[i]
                    };
                    return item;
                }
            }
        }
        return this.callSuper(arguments);
    },

    getXRange: function () {
        return [this.dataRange[0], this.dataRange[2]];
    },

    getYRange: function () {
        return [this.dataRange[1], this.dataRange[3]];
    }
}, function () {
    var klass = this;
    // TODO: [HACK] Steal from cartesian series.
    klass.prototype.onAxesChanged = Ext.chart.series.Cartesian.prototype.onAxesChanged;
    klass.prototype.getSprites = Ext.chart.series.Cartesian.prototype.getSprites;
});

