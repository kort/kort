/**
 * Demonstrates how use Ext.chart.series.Line
 */
//<feature charts>
Ext.define('Kitchensink.view.LineChart', {
    extend: 'Ext.Panel',
    requires: ['Ext.chart.Chart',
               'Ext.chart.series.Line',
               'Ext.chart.axis.Numeric',
               'Ext.chart.axis.Time',
               'Ext.chart.interactions.CrossZoom'],
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
                    }
                ]
            },
            {
                xtype: 'chart',
                store: 'USD2EUR',
                background: 'white',
                interactions: [
                    {
                        type: 'crosszoom',
                        zoomOnPanGesture: false
                    }
                ],
                series: [
                    {
                        type: 'line',
                        xField: 'time',
                        yField: 'value',
                        style: {
                            fill: Kitchensink.view.ColorPatterns.getBaseColors(0),
                            stroke: Kitchensink.view.ColorPatterns.getBaseColors(0),
                            fillOpacity: 0.6,
                            miterLimit: 3,
                            lineCap: 'miter',
                            lineWidth: 2
                        }
                    }
                ],
                axes: [
                    {
                        type: 'numeric',
                        position: 'left',
                        fields: ['value'],
                        title: {
                            text: 'USD to Euro',
                            fontSize: 20
                        }
                    },
                    {
                        type: 'time',
                        dateFormat: 'Y-m-d',
                        visibleRange: [0, 1],
                        position: 'bottom',
                        fields: 'time',
                        title: {
                            text: 'Date',
                            fontSize: 20
                        }
                    }
                ]
            }
        ]
    },
    initialize: function () {
        this.callSuper();
        var toolbar = Ext.ComponentQuery.query('toolbar', this)[0],
            interaction = Ext.ComponentQuery.query('interaction', this)[0];
        if (toolbar && interaction) {
            toolbar.add(interaction.getUndoButton());
        }
    }
});
//</feature>
