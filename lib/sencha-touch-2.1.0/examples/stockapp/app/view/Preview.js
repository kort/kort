Ext.define("StockApp.view.Preview", {
    extend: 'Ext.chart.CartesianChart',
    requires: ['StockApp.sprite.RangeMask'],
    xtype: 'preview',
    config: {
        docked: 'bottom',
        insetPadding: 0,
        background: 'white',
        series: [
            {
                store: 'Apple',
                type: 'line',
                xField: 'date',
                yField: 'close',
                style: {
                    stroke: 'rgba(237,123,43,0.75)',
                    fill: 'rgba(237,123,43,0.1)',
                    miterLimit: 1
                }
            },
            {
                store: 'Google',
                type: 'line',
                xField: 'date',
                yField: 'close',
                style: {
                    stroke: 'rgba(67,175,174,0.75)',
                    fill: 'rgba(67,175,174,0.1)',
                    miterLimit: 1
                }
            }
//            {
//                store: 'Autodesk',
//                type: 'line',
//                xField: 'date',
//                yField: 'close',
//                style: {
//                    stroke: 'rgba(221,31,74,0.75)',
//                    fill: 'rgba(221,31,74,0.1)',
//                    miterLimit: 1
//                }
//            },
//            {
//                store: 'IBM',
//                type: 'line',
//                xField: 'date',
//                yField: 'close',
//                style: {
//                    stroke: 'rgba(255,76,77,0.75)',
//                    fill: 'rgba(255,76,77,0.1)',
//                    miterLimit: 1
//                }
//            },
//            {
//                store: 'Microsoft',
//                type: 'line',
//                xField: 'date',
//                yField: 'close',
//                style: {
//                    stroke: 'rgba(24,121,34,0.75)',
//                    fill: 'rgba(24,121,34,0.1)',
//                    miterLimit: 1
//                }
//            },
//            {
//                store: 'Oracle',
//                type: 'line',
//                xField: 'date',
//                yField: 'close',
//                style: {
//                    stroke: 'rgba(254,166,58,0.75)',
//                    fill: 'rgba(254,166,58,0.1)',
//                    miterLimit: 1
//                }
//            }
        ],
        axes: [
            {
                type: 'numeric',
                position: 'left',
                fields: ['close'],
                hidden: true
            },
            {
                type: 'time',
                position: 'bottom',
                fields: ['date'],
                style: {
                    axisLine: false,
                    strokeStyle: '#666',
                    estStepSize: 150
                },
                dateFormat: 'Y',
                segmenter: {
                    type: 'time',
                    step: {
                        unit: 'y',
                        step: 1
                    }
                },
                label: {
                    fontSize: 10,
                    fillStyle: '#666'
                }
            }
        ],
        sprites: [
            {
                type: 'rangemask',
                surface: 'overlay',
                visibleRange: [0.5, 0.9],
                fill: 'rgba(0,0,0,0.15)',
                opacity: 1
            }
        ]
    },


    initialize: function () {
        this.callParent();
        this.getSurface('overlay').element.setStyle({zIndex: 100});
        this.rangeMask = this.getSurface('overlay').getItems().items[0];
        this.rangeMask.fx.setCustomDuration({'handlerOpacity': 100});
        this.dragStatus = {};
        this.element.on('touchstart', 'onTouchStart', this);
        this.element.on('touchmove', 'onTouchMove', this);
        this.element.on('touchend', 'onTouchEnd', this);
    },

    onTouchStart: function (e) {
        var xy = this.element.getXY(),
            axis = this.axis || (this.axis = Ext.ComponentQuery.query('#mainChart axis')[1]),
            width = this.element.getSize().width,
            x,
            ident,
            min = width * this.rangeMask.attr.visibleRange[0],
            max = width * this.rangeMask.attr.visibleRange[1],
            any = false, i;
        for (i = 0; i < e.touches.length; i++) {
            x = e.touches[i].pageX - xy[0];
            ident = e.touches[i].identifier;
            if (min + 22 < x && x < max - 22 && !this.dragStatus.pan) {
                any = true;
                this.dragStatus.pan = {
                    ident: ident,
                    x: x,
                    type: 'pan'
                };
            } else if (x - 22 < max && max < x + 22 && !this.dragStatus.right) {
                any = true;
                this.dragStatus.right = {
                    ident: ident,
                    x: x,
                    type: 'right'
                };
            } else if (x - 22 < min && min < x + 22 && !this.dragStatus.left) {
                any = true;
                this.dragStatus.left = {
                    ident: ident,
                    x: x,
                    type: 'left'
                };
            }


        }
        if (any) {
            this.rangeMask.fx.setCustomDuration({'handlerOpacity': 0});
            this.rangeMask.setAttributes({handlerOpacity: 1});
            this.rangeMask.getParent().renderFrame();
        }
    },

    onTouchMove: function (e) {
        var xy = this.element.getXY(),
            axis = this.axis,
            width = this.element.getSize().width,
            ident = e.touch.identifier,
            gap = 5 / width,
            dx,
            min = this.rangeMask.attr.visibleRange[0],
            max = this.rangeMask.attr.visibleRange[1];
        if (this.dragStatus.pan && this.dragStatus.pan.ident === ident) {
            dx = (e.touch.point.x - this.dragStatus.pan.x) / width;
            this.dragStatus.pan.x = e.touch.point.x;
            min += dx;
            max += dx;
            if (min < 0) {
                max -= min;
                min = 0;
            }
            if (max > 1) {
                min -= max - 1;
                max = 1;
            }
        }
        else if (this.dragStatus.left && this.dragStatus.left.ident === ident) {
            dx = (e.touch.point.x - this.dragStatus.left.x) / width;
            this.dragStatus.left.x = e.touch.point.x;
            min += dx;
            if (min < 0) {
                min = 0;
            }
            if (min > max - gap) {
                min = max - gap;
            }
        } else if (this.dragStatus.right && this.dragStatus.right.ident === ident) {
            dx = (e.touch.point.x - this.dragStatus.right.x) / width;
            this.dragStatus.right.x = e.touch.point.x;
            max += dx;
            if (max > 1) {
                max = 1;
            }
            if (max < min + gap) {
                max = min + gap;
            }
        } else {
            return;
        }
        axis.setVisibleRange([min, max]);
        this.rangeMask.setAttributes({visibleRange: [min, max]});
        this.getSurface('overlay').renderFrame();
        Ext.getCmp('mainChart').performLayout();
    },

    onTouchEnd: function (e) {
        for (var i in {pan: 0, left: 0, right: 0}) {
            if (this.dragStatus[i]) {
                var ident = this.dragStatus[i].ident;
                for (var j = 0; j < e.touches.length; j++) {
                    if (ident === e.touches[j].identifier) {
                        break;
                    }
                }
                if (j === e.touches.length) {
                    delete this.dragStatus[i];
                }
            }
        }
        if (!this.dragStatus.pan && !this.dragStatus.left && !this.dragStatus.right) {
            this.rangeMask.fx.setCustomDuration({'handlerOpacity': 500});
            this.rangeMask.setAttributes({handlerOpacity: 0});
        }
    },

    performLayout: function () {
        this.callParent();
        var surface = this.getSurface('overlay'),
            size = this.element.getSize();
        this.rangeMask.setAttributes({
            scalingCenterX: 0,
            scalingCenterY: 0,
            scalingX: size.width,
            scalingY: size.height
        });
        surface.setRegion([0, 0, size.width, size.height]);
        surface.renderFrame();
    }
});