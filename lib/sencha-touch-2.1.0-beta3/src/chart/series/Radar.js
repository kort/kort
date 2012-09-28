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
 *             showMarkers: true,
 *             markerConfig: {
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
 *             showMarkers: true,
 *             showInLegend: true,
 *             markerConfig: {
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
 *             showMarkers: true,
 *             showInLegend: true,
 *             markerConfig: {
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
 * In this configuration we add three series to the chart. Each of these series is bound to the same categories field, `name` but bound to different properties for each category,
 * `data1`, `data2` and `data3` respectively. All series display markers by having `showMarkers` enabled. The configuration for the markers of each series can be set by adding properties onto
 * the markerConfig object. Finally we override some theme styling properties by adding properties to the `style` object.
 *
 */
Ext.define('Ext.chart.series.Radar', {
    extend: 'Ext.chart.series.Polar',
    type: "radar",
    seriesType: 'radar',
    alias: 'series.radar',
    requires: ['Ext.chart.series.sprite.Radar'],
    /**
     * @cfg {Object} style
     * An object containing styles for overriding series styles from theming.
     */

    config: {

        /**
         * @cfg {String} xField
         * The store record field name for the labels used in the radar series.
         */
        xField: null,

        /**
         * @cfg {Object} yField
         * The store record field name for the deflection of the graph in the radar series.
         */
        yField: null
    },

    processData: function () {
        var me = this,
            store = me.getActualStore(),
            items = store.getData().items,
            length = items.length,
            xField = me.getXField(),
            yField = me.getYField();
        
        if (!store || items.length === 0) {
            return;
        }
        
        var item = items[0],
            x = +item.get(xField),
            y = +item.get(yField),
            minX = x, maxX = x,
            minY = y, maxY = y,
            dataX = [], dataY = [];
        // TODO: rewrite this with axis coordination.
        for (var i = 1; i < length; i++) {
            item = items[i];
            x = +item.get(xField);
            y = +item.get(yField);
            if (minX > x) {
                minX = x;
            } else if (maxX < x) {
                maxX = x;
            }
            if (minY > y) {
                minY = y;
            } else if (maxY < y) {
                maxY = y;
            }
            dataX.push(x);
            dataY.push(y);
        }
        me.dataRange = [minX, minY, maxX, maxY];

        me.getSprites()[0].setAttributes({
            dataRange: me.dataRange,
            dataX: dataX,
            dataY: dataY
        });
    },

    getSprites: function () {
        var me = this,
            chart = this.getChart(),
            surface = me.getSurface(),
            animation = chart && chart.getAnimate(),
            sprites = this.sprites,
            sprite = sprites[0],
            radius = me.getRadius(),
            center = me.getCenter(),
            offsetX = me.getOffsetX(),
            offsetY = me.getOffsetY();

        if (!chart) {
            return [];
        }
        if (!sprite) {
            sprite = surface.add({type: 'radar'});
            me.sprites.push(sprite);
        }
        if (animation) {
            sprite.fx.setConfig(animation);
            sprite.setAttributes(Ext.applyIf({
                centerX: center[0] + offsetX,
                centerY: center[1] + offsetY,
                startRho: 0,
                endRho: radius
            }, this.getStyle()));
        }

        if (me.getMarker()) {
            sprite.bindMarker('items', me.getMarker());
        }

        return me.sprites;
    }
});

