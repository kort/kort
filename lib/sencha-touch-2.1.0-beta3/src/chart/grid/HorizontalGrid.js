/**
 *
 */
Ext.define("Ext.chart.grid.HorizontalGrid", {
    extend: 'Ext.chart.Markers',
    requires: ['Ext.chart.grid.HorizontalGridPart'],
    config: {
        template: {
            xclass: 'Ext.chart.grid.HorizontalGridPart'
        }
    }
});