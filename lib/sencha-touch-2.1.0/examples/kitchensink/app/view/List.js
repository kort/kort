/**
 * Demonstrates how to create a simple List based on inline data.
 * First we create a simple Contact model with first and last name fields, then we create a Store to contain
 * the data, finally we create the List itself, which gets its data out of the Store
 */

Ext.define('Kitchensink.view.List', {
    extend: 'Ext.tab.Panel',
    requires: ['Kitchensink.model.Contact'],
    config: {
        tabBar: {
            docked: 'top',
            ui: 'neutral',
            layout: {
                pack: 'center'
            }
        },
        items: [{
            title: 'Simple',
            layout: Ext.os.deviceType == 'Phone' ? 'fit' : {
                type: 'vbox',
                align: 'center',
                pack: 'center'
            },
            cls: 'demo-list',
            items: [{
                width: Ext.os.deviceType == 'Phone' ? null : 300,
                height: Ext.os.deviceType == 'Phone' ? null : 500,
                xtype: 'list',
                store: 'List',
                itemTpl: '<div class="contact"><strong>{firstName}</strong> {lastName}</div>',
                variableHeights: false
            }]
        }, {
            title: 'Grouped',
            layout: Ext.os.deviceType == 'Phone' ? 'fit' : {
                type: 'vbox',
                align: 'center',
                pack: 'center'
            },
            cls: 'demo-list',
            items: [{
                width: Ext.os.deviceType == 'Phone' ? null : 300,
                height: Ext.os.deviceType == 'Phone' ? null : 500,
                xtype: 'list',
                store: 'List',
                itemTpl: '<div class="contact"><strong>{firstName}</strong> {lastName}</div>',
                grouped: true,
                pinHeaders: false,
                indexBar: true,
                variableHeights: false
            }]
        }, {
            title: 'Disclosure',
            layout: Ext.os.deviceType == 'Phone' ? 'fit' : {
                type: 'vbox',
                align: 'center',
                pack: 'center'
            },
            cls: 'demo-list',
            items: [{
                width: Ext.os.deviceType == 'Phone' ? null : 300,
                height: Ext.os.deviceType == 'Phone' ? null : 500,
                xtype: 'list',
                pinHeaders: false,
                onItemDisclosure: function(record, btn, index) {
                    Ext.Msg.alert('Tap', 'Disclose more info for ' + record.get('firstName'), Ext.emptyFn);
                },
                store: 'List', //getRange(0, 9),
                itemTpl: '<div class="contact"><strong>{firstName}</strong> {lastName}</div>',
                variableHeights: false
            }]
        }]
    }
});
