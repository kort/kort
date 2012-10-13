Ext.define('TouchStyle.view.phone.ProductsList', {
    extend: 'TouchStyle.view.ProductsList',
    requires: ['TouchStyle.view.phone.Products'],

    config: {
        count: 1,

        innerItemConfig: {
            xclass: 'TouchStyle.view.phone.Products'
        },

        directionLock: true
    }
});
