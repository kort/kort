/**
 * @class Ext.chart.series.Pie
 * @extends Ext.chart.series.Series
 *
 * Creates a Pie Chart. A Pie Chart is a useful visualization technique to display quantitative information for different
 * categories that also have a meaning as a whole.
 * As with all other series, the Pie Series must be appended in the *series* Chart array configuration. See the Chart
 * documentation for more information. A typical configuration object for the pie series could be:
 *
 * {@img Ext.chart.series.Pie/Ext.chart.series.Pie.png Ext.chart.series.Pie chart series}
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
 *         store: store,
 *         theme: 'Base:gradients',
 *         series: [{
 *             type: 'pie',
 *             angleField: 'data1',
 *             showInLegend: true,
 *             tips: {
 *               trackMouse: true,
 *               width: 140,
 *               height: 28,
 *               renderer: function(storeItem, item) {
 *                 //calculate and display percentage on hover
 *                 var total = 0;
 *                 store.each(function(rec) {
 *                     total += rec.get('data1');
 *                 });
 *                 this.setTitle(storeItem.get('name') + ': ' + Math.round(storeItem.get('data1') / total * 100) + '%');
 *               }
 *             },
 *             highlight: {
 *               margin: 20
 *             },
 *             label: {
 *                 field: 'name',
 *                 display: 'rotate',
 *                 contrast: true,
 *                 font: '18px Arial'
 *             }
 *         }]
 *     });
 *
 * In this configuration we set `pie` as the type for the series, set an object with specific style properties for highlighting options
 * (triggered when hovering elements). We also set true to `showInLegend` so all the pie slices can be represented by a legend item.
 * We set `data1` as the value of the field to determine the angle span for each pie slice. We also set a label configuration object
 * where we set the field name of the store field to be renderer as text for the label. The labels will also be displayed rotated.
 * We set `contrast` to `true` to flip the color of the label if it is to similar to the background color. Finally, we set the font family
 * and size through the `font` parameter.
 *
 */
Ext.define('Ext.chart.series.Pie', {
    extend: 'Ext.chart.series.Polar',
    requires: [
        "Ext.chart.series.sprite.PieSlice"
    ],
    type: 'pie',
    alias: 'series.pie',

    config: {

        highlightCfg: {
            margin: 20
        },


        /**
         * @cfg {String} angleField (required)
         * The store record field name to be used for the pie angles.
         * The values bound to this field name must be positive real numbers.
         */
        field: false,

        /**
         * @cfg {String} lengthField
         * The store record field name to be used for the pie slice lengths.
         * The values bound to this field name must be positive real numbers.
         */
        lengthField: false,

        /**
         * @cfg {String} labelField
         * The store record field name to be used for the pie slice labels.
         */
        labelField: false,

        /**
         * @cfg {Boolean/Number} donut Whether to set the pie chart as donut chart.
         * Can be set to a particular percentage to set the radius of the donut chart.
         */
        donut: false,

        rotation: 0
    },

    processData: function () {
        var me = this,
            store = me.getActualStore(),
            items = store.getData().items,
            length = items.length,
            field = me.getField(),
            labelField = me.getLabelField(),
            value, sum = 0, ratio,
            summation = [], i,
            sprites = this.getSprites(),
            sprite = sprites[0],
            twoPie = Math.PI * 2,
            lastAngle;

        if (!sprite) {
            return;
        }

        for (i = 0; i < length; i++) {
            value = items[i].get(field);
            sum += value;
            summation[i] = sum;
        }
        if (sum === 0) {
            return;
        }
        ratio = 2 * Math.PI / sum;
        for (i = 0; i < length; i++) {
            summation[i] *= ratio;
        }

        for (i = 0, lastAngle = 0; i < length; i++) {
            sprite.setAttributesFor(i, {
                globalAlpha: 1,
                startAngle: lastAngle,
                endAngle: summation[i]
            });
            lastAngle = summation[i];
        }

        // Hide the others
        for (i = length; i < sprite.instances.length; i++) {
            sprite.setAttributesFor(i, {
                globalAlpha: 0,
                startAngle: twoPie,
                endAngle: twoPie
            });
        }

        if (labelField) {
            for (i = 0, lastAngle = 0; i < length; i++) {
                sprite.setAttributesFor(i, {
                    label: String(items[i].get(labelField))
                });
            }
            for (i = length; i < sprites.length; i++) {
                sprite.setAttributesFor(i, {
                    label: ''
                });
            }
        }
    },

    getSprites: function () {
        var me = this,
            chart = this.getChart(),
            surface = me.getSurface(),
            store = me.getActualStore();
        if (!chart || !store) {
            return[];
        }
        var items = store.getData().items,
            length = items.length,
            animation = chart && chart.getAnimate(),
            center = me.getCenter(),
            offsetX = me.getOffsetX(),
            offsetY = me.getOffsetY(),
            radius = me.getRadius(),
            donut = me.getDonut(),
            rotation = me.getRotation(),
            twoPie = 2 * Math.PI,
            sprite = me.sprites[0], i, style;

        if (!sprite) {
            sprite = surface.add({
                type: 'instancing',
                translationX: center[0] + offsetX,
                translationY: center[1] + offsetY,
                rotationRads: rotation
            });

            sprite.setTemplate({
                type: 'pieslice',
                centerX: 0,
                centerY: 0,
                startRho: radius * donut * 0.01, // Percentage
                endRho: radius,
                startAngle: twoPie,
                endAngle: twoPie
            });

            me.sprites.push(sprite);
            if (me.getLabel()) {
                me.getLabel().setAttributes({
                    translationX: center[0] + offsetX,
                    translationY: center[1] + offsetY,
                    rotationRads: rotation,
                    labelOverflowPadding: this.getLabelOverflowPadding()
                });
                me.getLabel().getTemplate().fx.setSpecialDuration({'callout': 200});
                sprite.getTemplate().bindMarker('labels', me.getLabel());
            }

            sprite.getTemplate().fx.setConfig(animation);
        } else {
            sprite.setAttributes({
                translationX: center[0] + offsetX,
                translationY: center[1] + offsetY,
                rotationRads: rotation
            });
            sprite.getTemplate().fx.setConfig(animation);
            sprite.getTemplate().setAttributes({
                centerX: 0,
                centerY: 0,
                startRho: radius * donut * 0.01, // Percentage
                endRho: radius
            });
        }

        for (i = 0; i < length; i++) {
            style = Ext.apply({}, this.getStyleByIndex(i));
            if (sprite.instances.length <= i) {
                sprite.createInstance(style);
            } else {
                sprite.setAttributesFor(i, style);
            }
        }

        return me.sprites;
    }
});

