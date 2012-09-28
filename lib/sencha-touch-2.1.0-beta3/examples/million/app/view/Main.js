Ext.define('Million.view.Main', {
    extend: 'Ext.Panel',
    requires: ['Ext.chart.Chart'],
    xtype: 'main',
    config: {
        layout: 'fit',
        items: [
            {
                xtype: 'titlebar',
                docked: 'top',
                title: 'One Million Data Chart'
            },
            {
                xtype: 'chart',
                interactions: ['panzoom'],
                series: {
                    type: 'line',
                    store: "Stock",
                    xField: 'x',
                    yField: 'y',
                    style: {
                        stroke: 'black',
                        fill: '#aad'
                    }
                },
                axes: [
                    {
                        type: 'numeric',
                        position: 'bottom',
                        fields: ['x'],
                        visibleRange: [0, 0.5]
                    },
                    {
                        type: 'numeric',
                        position: 'left',
                        fields: ['y']
                    }
                ]
            }
        ]
    },
    initialize: function () {
        this.callSuper();
        var toolbar = Ext.ComponentQuery.query('titlebar', this)[0],
            interaction = Ext.ComponentQuery.query('interaction', this)[0];
        if (toolbar && interaction) {
            toolbar.add(interaction.getModeToggleButton());
        }
    }
});