Ext.define('TouchStyle.controller.tablet.Category', {
    extend: 'TouchStyle.controller.Category',

    config: {
        refs: {
            productView: {
                autoCreate: true,
                xtype: 'product',
                selector: 'product'
            }
        }
    },

    init: function() {
        this.callParent();

        this.productsView = Ext.create('TouchStyle.view.ProductsList');
        this.productView = Ext.create('TouchStyle.view.tablet.Product');
    },

    /**
     * @inherit
     */
    getProductsView: function() {
        return this.productsView;
    },

    /**
     * @inherit
     */
    getProductView: function() {
        return this.productView;
    },

    /**
     * @inherit
     */
    onProductTap: function(view, record) {
        var productView = this.getProductView();

        productView.setData(record.data);

        if (!productView.getParent()) {
            Ext.Viewport.add(productView);
        }

        productView.show();
    }
});
