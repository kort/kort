Ext.define('Oreilly.view.session.Card', {

    extend: 'Ext.NavigationView',
    xtype: 'sessionContainer',

    config: {

        title: 'Sessions',
        iconCls: 'time',

        autoDestroy: false,

        items: [
            {
                xtype: 'sessions',
                store: 'Sessions',
                grouped: true,
                pinHeaders: false
            }
        ]
    }
});
