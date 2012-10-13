Ext.define('Device.view.Purchases', {
    extend: 'Ext.tab.Panel',
    xtype: 'purchases',

    requires: [
        'Ext.device.Purchases'
    ],

    config: {
        tabBar: {
            ui: 'light'
        },

        items: [
            {
                xtype: 'toolbar',
                docked: 'bottom',
                items: [
                    {
                        xtype: 'button',
                        text: 'Load Products',
                        itemId: 'loadProducts'
                    },
                    {
                        xtype: 'button',
                        text: 'Load Purchases',
                        itemId: 'loadPurchases'
                    }
                ]
            },
            {
                title: 'Products',
                xtype: 'list',
                itemTpl: '{productIdentifier} - {price}',
                itemId: 'products',
                items: [
                    {
                        xtype: 'toolbar',
                        docked: 'top',
                        items: [
                            {
                                xtype: 'button',
                                text: 'Purchase Product',
                                itemId: 'purchaseProduct',
                                disabled: true
                            }
                        ]
                    }
                ]
            },
            {
                title: 'Purchases',
                xtype: 'list',
                itemTpl: '{productIdentifier}',
                itemId: 'purchases',
                items: [
                    {
                        xtype: 'toolbar',
                        docked: 'top',
                        items: [
                            {
                                xtype: 'button',
                                text: 'Complete Purchase',
                                itemId: 'completePurchase',
                                disabled: true
                            }
                        ]
                    }
                ]
            }
        ]
    }
});
