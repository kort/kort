/**
 * Demonstrates how use Ext.chart.series.Pie
 */
Ext.define('Kitchensink.view.PieChart', {
    extend: 'Ext.Panel',
    requires: ['Ext.chart.PolarChart', 'Ext.chart.series.Pie', 'Ext.chart.interactions.Rotate'],
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
                        handler: function (a, b, c, d, e) {
                            Ext.ComponentQuery.query('polar')[0].setAnimate({
                                duration: 500,
                                easing: 'easeInOut'
                            });
                            Ext.getStore('Pie').generateData(9);
                        }
                    }
                ]
            },
            {
                xtype: 'polar',
                store: 'Pie',
                colors: Kitchensink.view.ColorPatterns.getBaseColors(),
                background: 'white',
                interactions: 'rotate',
                animate: {
                    duration: 1500,
                    easing: 'easeIn'
                },
                insetPadding: 45,
                series: [
                    {
                        type: 'pie',
                        field: 'g1',
//                        lengthField: 'value',
                        labelField: 'name',
                        donut: 30,
                        style: {
                            stroke: 'white',
                            miterLimit: 10,
                            lineCap: 'miter',
                            lineWidth: 2
                        }
                    }
                ],
                axes: [
                ]
            }
        ]
    },
    initialize: function () {
        this.callParent();
        Ext.getStore('Pie').generateData(9);
    }
});
