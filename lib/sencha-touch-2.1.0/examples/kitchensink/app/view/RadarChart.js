/**
 * Demonstrates how use Ext.chart.series.Radar
 */
//<feature charts>
Ext.define('Kitchensink.view.RadarChart', {
    extend: 'Ext.Panel',
    requires: ['Ext.chart.PolarChart',
               'Ext.Toolbar',
               'Ext.TitleBar',
               'Ext.chart.series.Radar',
               'Ext.chart.axis.Numeric',
               'Ext.chart.axis.Category',
               'Ext.chart.interactions.Rotate',
               'Ext.Button'],
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
                        text: 'Refresh',
                        handler: function () {
                            Ext.getStore('OrderItems').generateData(10 + 10 * Math.random());
                        }
                    }
                ]
            },
            {
                xtype: 'polar',
                store: 'OrderItems',
                background: 'white',
                interactions: 'rotate',
                series: [
                    {
                        type: 'radar',
                        xField: 'id',
                        yField: 'g1',
                        style: {
                            fillStyle: 'rgba(0,255,0,0.2)',
                            strokeStyle: 'rgba(0,0,0,0.8)',
                            lineWidth: 1
                        }
                    }
                ],
                axes: [
                    {
                        type: 'numeric',
                        position: 'radial',
                        fields: 'g1',
                        grid: true,
                        style: {
                            estStepSize: 20
                        },
                        label: {
                            fill: 'black'
                        }
                    },
                    {
                        type: 'category',
                        position: 'angular',
                        fields: 'id',
                        grid: true,
                        style: {
                            estStepSize: 2
                        },
                        label: {
                            fill: 'black'
                        }
                    }
                ]
            }
        ]
    },
    initialize: function () {
        this.callSuper();
        Ext.getStore('OrderItems').generateData(10 + 10 * Math.random());
    }
});
//</feature>
