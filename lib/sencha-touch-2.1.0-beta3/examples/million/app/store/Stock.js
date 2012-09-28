var seed = 1.3333;
var random = function () {
    seed *= 29;
    seed = seed - Math.floor(seed);
    return seed;
};

/**
 * Faster store
 */
Ext.define("Million.store.Stock", {
    extend: "Ext.data.Store",
    alias: 'store.stock',
    config: {
        fields: ['time',
            'value1', 'value2', 'value3', 'value4', 'value5',
            'value6', 'value7', 'value8', 'value9', 'value10'
        ],
        data: {items: []},
        storeId: "Stock"
    },
    constructor: function (config) {
        this.callSuper([config]);
        this.generateData();
        Ext.data.StoreManager.register(this);
    },

    generateData: function () {
        var data = [
            {data: {x: 0, y: 1e6}}
        ];
        for (var i = 1; i < 1000000; i++) {
            data.push({data: {
                x: i,
                y: data[i - 1].data.y + (30 * random() - 15) * 10
            }});
        }
        this.setData(data);
    },

    applyData: function (data) {
        return {items: data};
    }
});