Ext.define('Kitchensink.view.tablet.TouchEvents', {
    extend: 'Kitchensink.view.TouchEvents',
    
    config: {
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
        
        items: [
            {
                docked: 'left',
                width: 250,
                id: 'touchinfopanel',
                
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                
                items: [
                    {
                        flex: 3,
                        scrollable: true,
                        
                        layout: {
                            type: 'vbox',
                            align: 'stretch'
                        },
                        
                        items: {
                            xtype: 'toucheventinfo'
                        }
                    },
                    {
                        xtype: 'toucheventlogger',
                        flex: 2
                    }
                ]
            },
            {
                xtype: 'toucheventpad',
                flex: 1
            }
        ]
    }
});