Ext.define("Ext.chart.series.CandleStick", {
    extend: "Ext.chart.series.Cartesian",
    requires: ['Ext.chart.series.sprite.CandleStick'],
    alias: 'series.candlestick',
    type: 'candlestick',
    seriesType: 'candlestickSeries',
    config: {
        openField: null,
        highField: null,
        lowField: null,
        closeField: null
    },

    fieldCategoryY: ['Open', 'High', 'Low', 'Close']
});