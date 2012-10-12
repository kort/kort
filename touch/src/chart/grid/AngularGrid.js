/**
 *
 */
Ext.define("Ext.chart.grid.AngularGrid", {
    extend: 'Ext.draw.sprite.Circle',
    alias: 'grid.angular',
    
    inheritableStatics: {
        def: {
            defaults: {
                r: 1,
                strokeStyle: '#DDD'
            }
        }
    }
});