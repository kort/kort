Ext.define('ChartMe.view.MainView', {
    extend: 'Ext.Container',

    requires: [
        'ChartMe.view.ChartContainer',
        'Ext.Toolbar'
    ],

    config: {
        id: 'MainView',
        layout: {
            type: 'vbox'
        },
        defaults: {
            layout: 'hbox',
            flex: 1
        },
        items: [
            {
                xtype: 'toolbar',
                docked: 'top',
                ui: 'light',
                title: 'Chart Me'
            },
            {
                xtype: 'container',
                id: 'topContainer',
                margin: '0 0 0 5',
                items: [
                    {
                        xtype: 'chartcontainer',
                        html: 'MINT',
                        id: 'topLeft'
                    },
                    {
                        xtype: 'chartcontainer',
                        html: 'EGO',
                        id: 'topRight'
                    }
                ]
            },
            {
                xtype: 'container',
                id: 'bottomContainer',
                margin: '0 0 5 5',
                defaults: {
                    flex: 1
                },
                items: [
                    {
                        xtype: 'chartcontainer',
                        html: 'LIVESTRONG',
                        id: 'bottomLeft'
                    },
                    {
                        xtype: 'container',
                        id: 'bottomRight',
                        margin: '0 5 0 0',
                        defaults: {
                            layout: 'hbox',
                            flex: 1
                        },
                        layout: {
                            type: 'vbox'
                        },
                        items: [
                            {
                                xtype: 'container',
                                items: [
                                    {
                                        xtype: 'chartcontainer',
                                        html: 'TWITTER',
                                        id: 'insideTopLeft'
                                    },
                                    {
                                        xtype: 'chartcontainer',
                                        html: 'BANK of AMERICA',
                                        id: 'insideTopRight'
                                    }
                                ]
                            },
                            {
                                xtype: 'container',
                                items: [
                                    {
                                        xtype: 'chartcontainer',
                                        html: 'FREECREDITREPORT.COM',
                                        id: 'insideBottomLeft'
                                    },
                                    {
                                        xtype: 'chartcontainer',
                                        html: 'XBOX LIVE',
                                        id: 'insideBottomRight',
                                        styleHtmlCls: ''
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }

});