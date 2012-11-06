/**
 * Demonstrates how use Ext.chart.series.Pie
 */
//<feature charts>
Ext.define('Kitchensink.view.GaugeChart', {
    extend: 'Ext.Panel',
    requires: ['Ext.chart.SpaceFillingChart', 'Ext.chart.series.Gauge'],
    config: {
        cls: 'card1',
        layout: 'fit',
        style: 'background: white',
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
                            Ext.getStore('Pie').generateData(1);
                        }
                    }
                ]
            },
            {
                layout: 'vbox',
                items: [
                    {
                        layout: 'hbox',
                        flex: 1,
                        items: [
                            {
                                xtype: 'spacefilling',
                                flex: 1,
                                store: 'Pie',
                                animate: {
                                    easing: 'elasticIn',
                                    duration: 1000
                                },
                                series: [
                                    {
                                        type: 'gauge',
                                        field: 'g1',
                                        labelField: 'name',
                                        minimum: 100,
                                        maximum: 800,
                                        donut: 30,
                                        subStyle: {
                                            fillStyle: ["#115fa6", "lightgrey"]
                                        },
                                        style: {
                                            miterLimit: 10,
                                            lineCap: 'miter',
                                            lineWidth: 2
                                        }
                                    }
                                ]
                            },
                            {
                                xtype: 'spacefilling',
                                flex: 1,
                                store: 'Pie',
                                colors: ["#115fa6", "lightgrey"],
                                series: [
                                    {
                                        type: 'gauge',
                                        field: 'g1',
                                        labelField: 'name',
                                        minimum: 100,
                                        maximum: 800,
                                        needle: true,
                                        donut: 30,
                                        subStyle: {
                                            stroke: ['red', 'none'],
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
                    {
                        layout: 'hbox',
                        flex: 1,
                        items: [
                            {
                                xtype: 'spacefilling',
                                flex: 1,
                                store: 'Pie',
                                colors: ["#115fa6", "lightgrey"],
                                series: [
                                    {
                                        type: 'gauge',
                                        field: 'g1',
                                        labelField: 'name',
                                        donut: 30,
                                        minimum: 100,
                                        maximum: 800,
                                        totalAngle: Math.PI * 2 / 3,
                                        style: {
                                            miterLimit: 10,
                                            lineCap: 'miter',
                                            lineWidth: 2
                                        }
                                    }
                                ]
                            },
                            {
                                xtype: 'spacefilling',
                                flex: 1,
                                store: 'Pie',
                                animate: {
                                    easing: 'bounceOut',
                                    duration: 500
                                },
                                colors: ["#115fa6", "lightgrey"],
                                series: [
                                    {
                                        type: 'gauge',
                                        field: 'g1',
                                        labelField: 'name',
                                        donut: 30,
                                        minimum: 100,
                                        maximum: 800,
                                        needle: true,
                                        wholeDisk: true,
                                        totalAngle: 3 * Math.PI / 2,
                                        subStyle: {
                                            stroke: ['orange', 'none'],
                                            miterLimit: 10,
                                            lineCap: 'miter',
                                            lineWidth: 2
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
    initialize: function () {
        this.callParent();
        Ext.getStore('Pie').generateData(1);
    }
});
//</feature>
