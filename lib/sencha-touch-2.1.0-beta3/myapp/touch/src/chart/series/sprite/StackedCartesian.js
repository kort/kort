/**
 * Stacked cartesian sprite.
 */
Ext.define("Ext.chart.series.sprite.StackedCartesian", {
    extend: 'Ext.chart.series.sprite.Cartesian',
    inheritableStatics: {
        def: {
            processors: {
                dataStartY: 'data'
            },
            defaults: {
                dataStartY: null,
                transformFillStroke: true
            },
            dirtyTriggers: {
                dataStartY: 'dataY,bbox'
            }
        }
    }
});