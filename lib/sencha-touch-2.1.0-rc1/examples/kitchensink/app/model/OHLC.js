Ext.define("Kitchensink.model.OHLC", {
    extend: 'Ext.data.Model',

    config: {
        fields: [
            {name: 'time',  type: 'time'},
            {name: 'open',  type: 'number'},
            {name: 'high',  type: 'number'},
            {name: 'low',   type: 'number'},
            {name: 'close', type: 'number'}
        ]
    }
});