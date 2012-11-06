/**
 * Demonstrates how use Ext.chart.series.Pie
 */
//<feature charts>
Ext.define('Kitchensink.view.PieChart3D', {
    extend: 'Ext.Panel',
    requires: ['Ext.chart.PolarChart', 'Ext.chart.series.Pie3D', 'Ext.chart.interactions.RotatePie3D'],
    config: {
        cls: 'card1',
        layout: 'fit',
        items: [
            {
                xtype: 'toolbar',
                top: 0,
                right: 0,
                zIndex: 50,
                style: {
                    background: 'none'
                },
                items: [
                    {
                        xtype: 'spacer'
                    },
                    {
                        iconCls: 'refresh',
                        iconMask: true,
                        text: '&nbsp;Refresh',
                        handler: function () {
                            Ext.ComponentQuery.query('polar', this.getParent().getParent())[0].setAnimate({
                                duration: 500,
                                easing: 'easeInOut'
                            });
                            Ext.getStore('Pie').generateData(9);
                        }
                    }
                ]
            },
            {
                xclass: 'Ext.chart.PolarChart',
                store: 'Pie',
                colors: Kitchensink.view.ColorPatterns.getBaseColors(),
                background: 'white',
                interactions: 'rotatePie3d',
                animate: {
                    duration: 1500,
                    easing: 'easeIn'
                },
                series: [
                    {
                        type: 'pie3d',
                        field: 'g1',
                        donut: 30,
                        distortion: 0.7,
                        style: {
                            stroke: "white"
                        }
                    }
                ]
            }
        ]
    },
    initialize: function () {
        this.callParent();
        Ext.getStore('Pie').generateData(9);
    }
});
//</feature>
