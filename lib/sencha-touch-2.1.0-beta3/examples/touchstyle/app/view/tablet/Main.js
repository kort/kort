Ext.define('TouchStyle.view.tablet.Main', {
    extend: 'TouchStyle.view.Main',

    requires: [
        'TouchStyle.view.ProductsList',
        'TouchStyle.view.tablet.Product'
    ],

    config: {
        useTitleForBackButtonText: true
    }
});
