(function () {
    var animations = {
        text: 'Animations',
        card: false,
        id: 'animations',
        items: [
            {
                text: 'Slide',
                id: 'Slide',
                items: [
                    {
                        text: 'Slide Left',
                        id: 'SlideLeft',
                        view: 'SlideLeft',
                        card: false,
                        animation: {
                            type: 'slide'
                        },
                        leaf: true
                    },
                    {
                        text: 'Slide Right',
                        card: false,
                        id: 'SlideRight',
                        view: 'SlideRight',
                        animation: {
                            type: 'slide',
                            direction: 'right'
                        },
                        leaf: true
                    },
                    {
                        text: 'Slide Up',
                        card: false,
                        id: 'SlideUp',
                        view: 'SlideUp',
                        animation: {
                            type: 'slide',
                            direction: 'up'
                        },
                        leaf: true
                    },
                    {
                        text: 'Slide Down',
                        card: false,
                        id: 'SlideDown',
                        view: 'SlideDown',
                        animation: {
                            type: 'slide',
                            direction: 'down'
                        },
                        leaf: true
                    }
                ]
            },
            {
                text: 'Fade',
                id: 'Fade',
                card: false,
                animation: {
                    type: 'fade',
                    duration: 500
                },
                leaf: true
            }
        ]};

    if (!Ext.os.is.Android2) {
        animations.items.push({
                text: 'Cover',
                id: 'Cover',
                items: [
                    {
                        text: 'Cover Left',
                        card: false,
                        view: 'CoverLeft',
                        id: 'CoverLeft',
                        animation: {
                            type: 'cover'
                        },
                        leaf: true
                    },
                    {
                        text: 'Cover Right',
                        card: false,
                        id: 'CoverRight',
                        view: 'CoverRight',
                        animation: {
                            type: 'cover',
                            direction: 'right'
                        },
                        leaf: true
                    },
                    {
                        text: 'Cover Up',
                        card: false,
                        view: 'CoverUp',
                        id: 'CoverUp',
                        animation: {
                            type: 'cover',
                            direction: 'up'
                        },
                        leaf: true
                    },
                    {
                        text: 'Cover Down',
                        card: false,
                        id: 'CoverDown',
                        view: 'CoverDown',
                        animation: {
                            type: 'cover',
                            direction: 'down'
                        },
                        leaf: true
                    }
                ]
            },
            {
                text: 'Reveal',
                id: 'Reveal',
                items: [
                    {
                        text: 'Reveal Left',
                        card: false,
                        id: 'RevealLeft',
                        view: 'RevealLeft',
                        animation: {
                            type: 'reveal'
                        },
                        leaf: true
                    },
                    {
                        text: 'Reveal Right',
                        card: false,
                        id: 'RevealRight',
                        view: 'RevealRight',
                        animation: {
                            direction: 'right',
                            type: 'reveal'
                        },
                        leaf: true
                    },
                    {
                        text: 'Reveal Up',
                        card: false,
                        id: 'RevealUp',
                        view: 'RevealUp',
                        animation: {
                            direction: 'up',
                            type: 'reveal'
                        },
                        leaf: true
                    },
                    {
                        text: 'Reveal Down',
                        card: false,
                        id: 'RevealDown',
                        view: 'RevealDown',
                        animation: {
                            direction: 'down',
                            type: 'reveal'
                        },
                        leaf: true
                    }
                ]
            }, {
                text: 'Pop',
                id: 'Pop',
                card: false,
                animation: {
                    type: 'pop'
                },
                leaf: true
            }, {
                text: 'Flip',
                id: 'Flip',
                card: false,
                animation: {
                    type: 'flip'
                },
                leaf: true
            });
    }

    var root = {
        id: 'root',
        text: 'Kitchen Sink',
        items: [
            {
                text: 'User Interface',
                id: 'ui',
                cls: 'launchscreen',
                items: [
                    {
                        text: 'Buttons',
                        leaf: true,
                        id: 'buttons'
                    },
                    {
                        text: 'Forms',
                        leaf: true,
                        id: 'forms'
                    },
                    {
                        text: 'List',
                        leaf: true,
                        id: 'list'
                    },
                    {
                        text: 'Nested List',
                        view: 'NestedList',
                        leaf: true,
                        id: 'nestedlist'
                    },
                    {
                        text: 'Icons',
                        leaf: true,
                        id: 'icons'
                    },
                    {
                        text: 'Toolbars',
                        leaf: true,
                        id: 'toolbars'
                    },
                    {
                        text: 'Carousel',
                        leaf: true,
                        id: 'carousel'
                    },
                    {
                        text: 'Tabs',
                        leaf: true,
                        id: 'tabs'
                    },
                    {
                        text: 'Bottom Tabs',
                        view: 'BottomTabs',
                        leaf: true,
                        id: 'bottom-tabs'
                    },
                    {
                        text: 'Overlays',
                        leaf: true,
                        id: 'overlays'
                    }
                ]
            }
        ]
    };

    root.items.push(animations, {
        text: 'Touch Events',
        id: 'touchevents',
        view: 'TouchEvents',
        leaf: true
    }, {
        text: 'Data',
        id: 'data',
        items: [
            {
                text: 'Nested Loading',
                view: 'NestedLoading',
                leaf: true,
                id: 'nestedloading'
            },
            {
                text: 'JSONP',
                leaf: true,
                id: 'jsonp'
            },
            {
                text: 'YQL',
                leaf: true,
                id: 'yql'
            },
            {
                text: 'Ajax',
                leaf: true,
                id: 'ajax'
            }
        ]
    }, {
        text: 'Media',
        id: 'media',
        items: [
            {
                text: 'Video',
                leaf: true,
                id: 'video'
            },
            {
                text: 'Audio',
                leaf: true,
                id: 'audio'
            }
        ]
    });

    //<feature charts>
        root.items.push({
            text: 'Graphics',
            id: 'graphics',
            items: [
                {
                    text: 'Cartesian Charts',
                    id: 'CartesianChart',
                    items: [
                        {
                            text: 'Area Chart',
                            view: 'AreaChart',
                            leaf: true,
                            id: 'AreaChart',
                            limit: 1
                        },
                        {
                            text: 'Line Chart (zoomable)',
                            view: 'LineChart',
                            leaf: true,
                            id: 'LineChart',
                            limit: 1
                        },
                        {
                            text: 'Line Chart (with Icons)',
                            view: 'LineChartWithMarker',
                            leaf: true,
                            id: 'LineChartWithMarker',
                            limit: 1
                        },
                        {
                            text: 'Column Chart',
                            view: 'ColumnChart',
                            leaf: true,
                            id: 'ColumnChart',
                            limit: 1
                        },
                        {
                            text: 'Bar Chart',
                            view: 'BarChart',
                            leaf: true,
                            id: 'BarChart',
                            limit: 1
                        },
                        {
                            text: 'Column Chart (Stacked)',
                            view: 'ColumnChartStacked',
                            leaf: true,
                            id: 'ColumnChartStacked',
                            limit: 1
                        },
                        {
                            text: 'Column Chart (3D)',
                            view: 'ColumnChart3D',
                            leaf: true,
                            id: 'ColumnChart3D',
                            limit: 1
                        },
                        {
                            text: 'Scatter Chart',
                            view: 'ScatterChart',
                            leaf: true,
                            id: 'ScatterChart',
                            limit: 1
                        },
                        {
                            text: 'Candlestick Chart',
                            view: 'CandlestickChart',
                            leaf: true,
                            id: 'CandlestickChart',
                            limit: 1
                        },
                        {
                            text: 'OHLC Chart',
                            view: 'OHLCChart',
                            leaf: true,
                            id: 'OHLCChart',
                            limit: 1
                        },
                        {
                            text: 'Plot Chart',
                            view: 'PlotChart',
                            leaf: true,
                            id: 'PlotChart',
                            limit: 1
                        },
                        {
                            text: 'Bubble Chart',
                            view: 'BubbleChart',
                            leaf: true,
                            id: 'BubbleChart',
                            limit: 1
                        }
                    ]
                },
                {
                    text: 'Polar Charts',
                    id: 'PolarChart',
                    items: [
                        {
                            text: 'Pie Chart',
                            view: 'PieChart',
                            leaf: true,
                            id: 'PieChart',
                            limit: 1
                        },
                        {
                            text: 'Pie Chart (3D)',
                            view: 'PieChart3D',
                            leaf: true,
                            id: 'PieChart3D',
                            limit: 1
                        },
                        {
                            text: 'Radar Chart',
                            view: 'RadarChart',
                            leaf: true,
                            id: 'RadarChart',
                            limit: 1
                        },
                        {
                            text: 'Gauge Chart',
                            view: 'GaugeChart',
                            leaf: true,
                            id: 'GaugeChart',
                            limit: 1
                        }
                    ]
                },
                {
                    text: 'Draw Component',
                    id: 'Draw',
                    items: [
                        {
                            text: 'Touch Paint',
                            view: 'FreeDraw',
                            leaf: true,
                            id: 'FreeDraw',
                            limit: 1
                        },
                        {
                            text: 'Vector Icons',
                            view: 'VectorIcons',
                            leaf: true,
                            id: 'VectorIcons',
                            limit: 1
                        }
                    ]
                }
            ]
        });
    //</feature>

    Ext.define('Kitchensink.store.Demos', {
        alias: 'store.Demos',
        extend: 'Ext.data.TreeStore',
        requires: ['Kitchensink.model.Demo'],

        config: {
            model: 'Kitchensink.model.Demo',
            root: root,
            defaultRootProperty: 'items'
        }
    });
})();
