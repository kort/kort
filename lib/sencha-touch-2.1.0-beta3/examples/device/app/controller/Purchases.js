Ext.define('Device.controller.Purchases', {
    extend: 'Ext.app.Controller',
    requires: ['Ext.device.Purchases'],

    config: {
        refs: {
            productsList: 'purchases list#products',
            purchasesList: 'purchases list#purchases',
            purchaseProduct: 'purchases #purchaseProduct',
            completePurchase: 'purchases #completePurchase'
        },

        control: {
            productsList: {
                deselect: 'onProductDeselect',
                select: 'onProductSelect'
            },
            purchasesList: {
                deselect: 'onPurchaseDeselect',
                select: 'onPurchaseSelect'
            },
            'purchases #loadProducts': {
                tap: 'loadProducts'
            },
            'purchases #loadPurchases': {
                tap: 'loadPurchases'
            },
            purchaseProduct: {
                tap: 'purchaseProduct'
            },
            completePurchase: {
                tap: 'completePurchase'
            }
        }
    },

    loadProducts: function() {
        var list = this.getProductsList();

        Ext.device.Purchases.getProducts({
            scope: this,
            success: function(store) {
                list.setStore(store);
            },
            failure: function() {
                Ext.device.Notification.show({
                    title: 'Product',
                    message: 'Problem loading products'
                });
            }
        });
    },

    purchaseProduct: function() {
        var list = this.getProductsList(),
            record = list.getSelection()[0];

        if (!record) {
            return;
        }

        record.purchase({
            success: function() {
                this.loadPurchases();

                Ext.device.Notification.show({
                    title: 'Purchase Product',
                    message: 'Problem completing purchase'
                });
            },
            failure: function() {
                Ext.device.Notification.show({
                    title: 'Purchase Product',
                    message: 'Problem purchasing product'
                });
            }
        });
    },

    completePurchase: function() {
        var list = this.getPurchasesList(),
            record = list.getSelection()[0];

        if (!record) {
            return;
        }

        record.complete({
            success: function() {
                this.loadPurchases();

                Ext.device.Notification.show({
                    title: 'Complete Purchase',
                    message: 'Purchase completed'
                });
            },
            failure: function() {
                Ext.device.Notification.show({
                    title:'Complete Purchase',
                    message: 'Problem completing purchase'
                });
            }
        });
    },

    onProductDeselect: function(view, record) {
        this.getPurchaseProduct().setDisabled(true);
    },

    onProductSelect: function(view, record) {
        this.getPurchaseProduct().setDisabled(false);
    },

    onPurchaseDeselect: function(view, record) {
        this.getCompletePurchase().setDisabled(true);
    },

    onPurchaseSelect: function(view, record) {
        this.getCompletePurchase().setDisabled(false);
    },

    loadPurchases: function() {
        var list = this.getPurchasesList();

        Ext.device.Purchases.getPendingPurchases({
            scope: this,
            success: function(store) {
                list.setStore(store);
            },
            failure: function() {
                Ext.device.Notification.show({
                    title: 'Error',
                    message: 'Problem loading purchases'
                });
            }
        });
    }
});
