Ext.define('TouchStyle.controller.phone.Category', {
    extend: 'TouchStyle.controller.Category',

    config: {

    },

    init: function() {
        this.callParent();

        this.productsView = Ext.create('TouchStyle.view.phone.ProductsList');
        this.productView = Ext.create('TouchStyle.view.tablet.Product');
    }
});
