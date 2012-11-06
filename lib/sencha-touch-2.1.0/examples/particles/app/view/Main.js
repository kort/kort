Ext.define("Particles.view.Main", {
    extend: 'Ext.Panel',
    requires: ['Ext.TitleBar', 'Ext.form.Panel'],
    config: {
        layout: 'fit',
        items: [
            {
                xtype: 'titlebar',
                title: 'Particles',
                docked: 'top',
                items: [
                    {
                        text: 'Flame',
                        action: 'flame'
                    },
                    {
                        text: 'Stars',
                        action: 'stars'
                    }
                ]
            },
            {
                xtype: 'particles'
            }
        ]
    }
});
