Ext.define("Kitchensink.store.StockPrice", {
    alias: 'store.StockPrice',
    requires: ['Kitchensink.model.OHLC'],
    extend: 'Ext.data.Store',
    config: {
        model: 'Kitchensink.model.OHLC',
        data: []
    },
    generateData: (function () {
        var seed = 1.4;

        // Controllable random.
        function random() {
            seed *= 42.7;
            seed -= Math.floor(seed);
            return seed * 2 - 1;
        }

        return function (count) {
            var data = [], i, record = {
                time: new Date('Jan 1 2010').getTime(),
                close: 600
            };
            for (i = 0; i < count; i++) {
                var ohlc = [random() * 25, random() * 25, random() * 25];
                record = {
                    time: record.time + 3600000,
                    open: record.close,
                    high: record.close + Math.max.apply(Math, ohlc),
                    low: record.close + Math.min.apply(Math, ohlc),
                    close: record.close + ohlc[1]
                };
                data.push(record);
            }
            this.setData(data);
        };
    })(),
    constructor: function () {
        this.callParent(arguments);
        this.generateData(1000);
        return this;
    }
});