//<feature charts>
(function () {
    /**
     * Demonstrates how to make a buble chart using Ext.chart.series.Scatter
     */
    Ext.define('Kitchensink.view.BubbleChart', {
        extend: 'Ext.Panel',
        requires: ['Ext.chart.Chart', 'Ext.chart.series.Scatter', 'Ext.chart.axis.Numeric'],
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
                                Ext.getStore('BubbleStore').setData(createData(50));
                            }
                        }
                    ]
                },
                {
                    xtype: 'chart',
                    store: {
                        storeId: 'BubbleStore',
                        fields: [ 'id', 'g1', 'g2', 'g3', 'g4', 'g5' ]
                    },
                    background: 'white',
                    interactions: ['panzoom', 'itemhighlight'],
                    innerPadding: 30,
                    series: [
                        {
                            type: 'scatter',
                            xField: 'id',
                            yField: 'g2',
                            highlightCfg: {
                                scale: 2
                            },
                            marker: {
                                type: 'circle',
                                radius: 5,
                                fill: 'rgb(203,143,203)',
                                miterLimit: 1,
                                lineCap: 'butt',
                                lineWidth: 1,
                                fx: {
                                    duration: 200
                                }
                            },
                            style: {
                                renderer: function (target, sprite, index, storeItem) {
                                    target.radius = interpolate(storeItem.data.g3, 0, 1000, 5, 30);
                                    target.fillOpacity = interpolate(storeItem.data.g3, 0, 1000, 1, 0.7);
                                    target.fill = interpolateColor(storeItem.data.g3, 0, 1000);
                                }
                            }
                        }
                    ],
                    axes: [
                        {
                            type: 'numeric',
                            position: 'left',
                            fields: ['g2'],
                            minimum: 0,
                            maximum: 1800,
                            style: {
                                estStepSize: 20
                            },
                            label: {
                                rotate: {
                                    degrees: -30
                                }
                            }
                        },
                        {
                            type: 'category',
                            position: 'bottom',
                            fields: ['id']
                        }
                    ]
                }
            ]
        },
        initialize: function () {
            this.callParent();
            Ext.getStore('BubbleStore').setData(createData(50));
        }
    });
    
    var seed = 1.3;

    // Controllable random.
    function random() {
        seed *= 7.3;
        seed -= Math.floor(seed);
        return seed;
    }

    function createData(count) {
        var data = [],
            record = {
                'id': 0,
                'g0': 300,
                'g1': 700 * random() + 100,
                'g2': 700 * random() + 100,
                'g3': 700 * random() + 100,
                'name': 'Item-0'
            },
            i;

        data.push(record);
        for (i = 1; i < count; i++) {
            record = {
                'id': i,
                'g0': record.g0 + 30 * random(),
                'g1': Math.abs(record.g1 + 300 * random() - 140),
                'g2': Math.abs(record.g2 + 300 * random() - 140),
                'g3': Math.abs(record.g3 + 300 * random() - 140)
            };
            data.push(record);
        }
        return data;
    }

    function interpolate(lambda, minSrc, maxSrc, minDst, maxDst) {
        return minDst + (maxDst - minDst) * Math.max(0, Math.min(1, (lambda - minSrc) / (maxSrc - minSrc)));
    }

    var fromHSL = Ext.draw.Color.fly('blue').getHSL(),
        toHSL = Ext.draw.Color.fly('red').getHSL();
    fromHSL[2] = 0.0;
    fromHSL[2] = 0.3;
    function interpolateColor(lambda, minSrc, maxSrc) {
        return Ext.draw.Color.fly(0, 0, 0, 0).setHSL(
            interpolate(lambda, minSrc, maxSrc, fromHSL[0], toHSL[0]),
            interpolate(lambda, minSrc, maxSrc, fromHSL[1], toHSL[1]),
            interpolate(lambda, minSrc, maxSrc, fromHSL[2], toHSL[2])
        ).toString();
    }
})();
//</feature>
