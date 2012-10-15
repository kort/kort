Ext.define("Particles.view.Properties", {
    extend: 'Ext.Sheet',
    config: {
        modal: true,
        items: {
            xtype: 'formpanel',
            width: 400,
            docked: 'right',
            title: 'Properties',
            items: [
                {
                    xtype: 'fieldset',
                    title: 'Start Color',
                    defaults: {
                        labelWidth: '35%',
                        labelAlign: 'left'
                    },
                    items: [
                        {
                            xtype: 'sliderfield',
                            name: 'thumb',
                            label: 'Red'
                        },
                        {
                            xtype: 'sliderfield',
                            name: 'thumb',
                            label: 'Green'
                        },
                        {
                            xtype: 'sliderfield',
                            name: 'thumb',
                            label: 'Blue'
                        },
                        {
                            xtype: 'sliderfield',
                            name: 'thumb',
                            label: 'Alpha'
                        }
                    ]
                }
            ]
        }
    }
});