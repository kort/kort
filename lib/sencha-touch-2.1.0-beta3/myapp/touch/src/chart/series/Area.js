/**
 * TODO: Finish documentation
 *
 */
Ext.define('Ext.chart.series.Area', {
    
    extend: 'Ext.chart.series.StackedCartesian',
    
    alias: 'series.area',
    type: 'area',
    seriesType: 'areaSeries',
    
    requires: ['Ext.chart.series.sprite.Area'],
    
    config: {
        highlightCfg: {
            lineWidth: 3,
            stroke: '#55c',
            opacity: 0.8,
            color: '#f00'
        }
    }
});
