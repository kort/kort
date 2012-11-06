//<feature charts>
Ext.define('Kitchensink.view.ColumnSeries3D', {
    extend: 'Ext.chart.series.Bar',
    requires: ['Kitchensink.view.sprite.Column3D'],
    seriesType: 'columnSeries3d',
    alias: 'series.column3d',
    type: 'column3d',
    config: {
        itemInstancing: null
    }
});
//</feature>