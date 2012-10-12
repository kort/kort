/**
 * TODO: Finish documentation
 *
 */
Ext.define('Ext.chart.series.Area', {
    
    extend: 'Ext.chart.series.StackedCartesian',
    
    alias: 'series.area',
    type: 'area',
    seriesType: 'areaSeries',
    
    requires: ['Ext.chart.series.sprite.Area']
});
