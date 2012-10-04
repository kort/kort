Ext.define('Device.view.Connection', {
    extend: 'Ext.Container',
    xtype: 'connection',

    requires: [
        'Ext.device.Connection'
    ],

    config: {
        layout : 'card',
        title  : 'Connection',
        iconCls: 'wifi3',
        styleHtmlContent: true,
        tpl: Ext.XTemplate([
            '<tpl if="online">',
                'You are currently <b>online</b> using a <b>{type}</b>.',
            '</tpl>',
            '<tpl if="!online">',
                'You are currently <b>offline</b>.',
            '</tpl>'
        ])
    },

    initialize: function() {
        this.callParent();

        Ext.device.Connection.on({
            scope: this,
            onlinechange: this.onlineChange
        });

        this.setData({
            online: Ext.device.Connection.getOnline(),
            type: Ext.device.Connection.getType()
        });
    },

    onlineChange: function(online, type) {
        this.setData({
            online: online,
            type: type
        });
    }
});
