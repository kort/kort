/**
 *
 */
Ext.define("Ext.chart.grid.VerticalGrid", {
    extend: 'Ext.chart.Markers',
    requires: ['Ext.chart.grid.VerticalGridPart'],
    config: {
        template: {
            xclass: 'Ext.chart.grid.VerticalGridPart'
        }
    }
});