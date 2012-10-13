/*
 * This panel sets up a DataView, which defines an XTemplate used to render our data. We also set up
 * the toolbar with the "Load Nested Data" button here
 */
Ext.require(['Ext.data.Store', 'Kitchensink.model.User'], function() {
    Ext.define('Kitchensink.view.NestedLoading', {
        extend: 'Ext.Container',
        config: {
            layout: 'fit',
            items: [
                {
                    docked: 'top',
                    xtype: 'toolbar',
                    items: [
                        {
                            text: 'Load Nested Data',
                            handler: function() {
                                Ext.getCmp('NestedLoadingDataView').getStore().load();
                            }
                        },
                        {
                            text: 'Explain',
                            handler: function() {
                                if (!this.explanation) {
                                    this.explanation = Ext.create('Ext.Panel', {
                                        modal: true,
                                        hideOnMaskTap: true,
                                        centered: true,
                                        width: 300,
                                        height: 200,
                                        styleHtmlContent: true,
                                        scrollable: true,
                                        items: {
                                            docked : 'top',
                                            xtype: 'toolbar',
                                            title: 'Loading Nested Data'
                                        },
                                        html: [
                                            '<p>The data package can load deeply nested data in a single request. In this example we are loading a fictional',
                                            'dataset containing Users, their Orders, and each Order\'s OrderItems.</p>',
                                            '<p>Instead of pulling down each record in turn, we load the full data set in a single request and allow the data',
                                            'package to automatically parse the nested data.</p>',
                                            '<p>As one of the more complex examples, it is worth tapping the "Source" button to see how this is set up.</p>'
                                        ].join("")
                                    });
                                    Ext.Viewport.add(this.explanation);
                                }
                                this.explanation.show();
                            }
                        }
                    ]
                },
                {
                    xtype: 'dataview',
                    id: 'NestedLoadingDataView',
                    emptyText: 'No Data Loaded',
                    styleHtmlContent: true,
                    /*
                     * The XTemplate allows us to easily render the data from our User model, as well as
                     * iterating over each User's Orders and OrderItems:
                     */
                    itemTpl: [
                        '<div class="user">',
                            '<h3>{name}\'s orders:</h3>',
                            '<tpl for="orders">',
                                '<div class="order" style="padding: 0 0 10px 20px;">',
                                    'Order: {id} ({status})',
                                    '<ul>',
                                    '<tpl for="orderItems">',
                                        '<li>{quantity} x {name}</li>',
                                    '</tpl>',
                                    '</ul>',
                                '</div>',
                            '</tpl>',
                        '</div>'
                    ].join(''),
                    store: new Ext.data.Store({
                        model: 'Kitchensink.model.User',
                        autoLoad: false
                    })
                }
            ]
        }
    });
});
