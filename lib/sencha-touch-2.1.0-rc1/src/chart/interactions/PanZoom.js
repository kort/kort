/**
 * The PanZoom interaction allows the user to navigate the data for one or more chart
 * axes by panning and/or zooming. Navigation can be limited to particular axes. Zooming is
 * performed by pinching on the chart or axis area; panning is performed by single-touch dragging.
 *
 * For devices which do not support multiple-touch events, zooming can not be done via pinch
 * gestures; in this case the interaction will allow the user to perform both zooming and
 * panning using the same single-touch drag gesture. Tapping the chart will switch between
 * the two modes, {@link #modeIndicatorDuration} briefly displaying a graphical indicator
 * showing whether it is in zoom or pan mode.
 *
 * You can attach this interaction to a chart by including an entry in the chart's
 * {@link Ext.chart.AbstractChart#interactions interactions} config with the `panzoom` type:
 *
 *     new Ext.chart.AbstractChart({
 *         renderTo: Ext.getBody(),
 *         width: 800,
 *         height: 600,
 *         store: store1,
 *         axes: [
 *             // ...some axes options...
 *         ],
 *         series: [
 *             // ...some series options...
 *         ],
 *         interactions: [{
 *             type: 'panzoom',
 *             axes: {
 *                 left: {
 *                     maxZoom: 5,
 *                     startZoom: 2
 *                 },
 *                 bottom: {
 *                     maxZoom: 2
 *                 }
 *             }
 *         }]
 *     });
 *
 * The configuration object for the `panzoom` interaction type should specify which axes
 * will be made navigable via the `axes` config. See the {@link #axes} config documentation
 * for details on the allowed formats. If the `axes` config is not specified, it will default
 * to making all axes navigable with the default axis options.
 *
 * @author Jason Johnston <jason@sencha.com>
 * @docauthor Jason Johnston <jason@sencha.com>
 */
Ext.define('Ext.chart.interactions.PanZoom', {

    extend: 'Ext.chart.interactions.Abstract',

    type: 'panzoom',
    alias: 'interaction.panzoom',
    requires: [
        'Ext.util.Region',
        'Ext.draw.Animator'
    ],

    config: {

        /**
         * @cfg {Object/Array} axes
         * Specifies which axes should be made navigable. The config value can take the following formats:
         *
         * - An Object whose keys correspond to the {@link Ext.chart.axis.Axis#position position} of each
         *   axis that should be made navigable. Each key's value can either be an Object with further
         *   configuration options for each axis or simply `true` for a default set of options.
         *       {
         *           type: 'panzoom',
         *           axes: {
         *               left: {
         *                   maxZoom: 5,
         *                   allowPan: false
         *               },
         *               bottom: true
         *           }
         *       }
         *
         *   If using the full Object form, the following options can be specified for each axis:
         *
         *   - minZoom (Number) A minimum zoom level for the axis. Defaults to `1` which is its natural size.
         *   - maxZoom (Number) A maximum zoom level for the axis. Defaults to `10`.
         *   - startZoom (Number) A starting zoom level for the axis. Defaults to `1`.
         *   - allowZoom (Boolean) Whether zooming is allowed for the axis. Defaults to `true`.
         *   - allowPan (Boolean) Whether panning is allowed for the axis. Defaults to `true`.
         *   - startPan (Boolean) A starting panning offset for the axis. Defaults to `0`.
         *
         * - An Array of strings, each one corresponding to the {@link Ext.chart.axis.Axis#position position}
         *   of an axis that should be made navigable. The default options will be used for each named axis.
         *
         *       {
         *           type: 'panzoom',
         *           axes: ['left', 'bottom']
         *       }
         *
         * If the `axes` config is not specified, it will default to making all axes navigable with the
         * default axis options.
         */
        axes: true,

        /**
         * @cfg {Boolean} showOverflowArrows
         * If `true`, arrows will be conditionally shown at either end of each axis to indicate that the
         * axis is overflowing and can therefore be panned in that direction. Set this to `false` to
         * prevent the arrows from being displayed.
         */
        showOverflowArrows: true,

        /**
         * @cfg {Object} overflowArrowOptions
         * A set of optional overrides for the overflow arrow sprites' options. Only relevant when
         * {@link #showOverflowArrows} is `true`.
         */

        gesture: 'pinch',

        panGesture: 'drag',

        zoomOnPanGesture: false,

        modeToggleButton: {
            cls: ['x-panzoom-toggle', 'x-zooming'],
            iconCls: 'x-panzoom-toggle-icon',
            iconMask: true
        },

        hideLabelInGesture: false //Ext.os.is.Android
    },

    stopAnimationBeforeSync: true,

    applyAxes: function (axesConfig) {
        var result = {};
        if (axesConfig === true) {
            return {
                top: {},
                right: {},
                bottom: {},
                left: {}
            };
        } else if (Ext.isArray(axesConfig)) {
            // array of axis names - translate to full object form
            result = {};
            Ext.each(axesConfig, function (axis) {
                result[axis] = {};
            });
        } else if (Ext.isObject(axesConfig)) {
            Ext.iterate(axesConfig, function (key, val) {
                // axis name with `true` value -> translate to object
                if (val === true) {
                    result[key] = {};
                } else if (val !== false) {
                    result[key] = val;
                }
            });
        }
        return result;
    },

    applyZoomOnPanGesture: function (zoomOnPanGesture) {
        this.getChart();
        if (this.isMultiTouch()) {
            return false;
        }
        return zoomOnPanGesture;
    },

    updateZoomOnPanGesture: function (zoomOnPanGesture) {
        if (!this.isMultiTouch()) {
            var button = this.getModeToggleButton(),
                zoomModeCls = Ext.baseCSSPrefix + 'zooming';
            if (zoomOnPanGesture) {
                button.addCls(zoomModeCls);
                if (!button.config.hideText) {
                    button.setText('&nbsp;Zoom');
                }
            } else {
                button.removeCls(zoomModeCls);
                if (!button.config.hideText) {
                    button.setText('&nbsp;Pan');
                }
            }
        }
    },

    toggleMode: function () {
        var me = this;
        if (!me.isMultiTouch()) {
            me.setZoomOnPanGesture(!me.getZoomOnPanGesture());
        }
    },

    applyModeToggleButton: function (button, oldButton) {
        var me = this,
            result = Ext.factory(button, "Ext.Button", oldButton);
        if (result && !oldButton) {
            result.setHandler(function () {
                me.toggleMode();
            });
        }
        return result;
    },

    getGestures: function () {
        var me = this,
            gestures = {};
        gestures[me.getGesture()] = 'onGesture';
        gestures[me.getGesture() + 'start'] = 'onGestureStart';
        gestures[me.getGesture() + 'end'] = 'onGestureEnd';
        gestures[me.getPanGesture()] = 'onPanGesture';
        gestures[me.getPanGesture() + 'start'] = 'onPanGestureStart';
        gestures[me.getPanGesture() + 'end'] = 'onPanGestureEnd';
        gestures.doubletap = 'onDoubleTap';
        return gestures;
    },

    onDoubleTap: function (e) {

    },

    onPanGestureStart: function (e) {
        if (!e || !e.touches || e.touches.length < 2) { //Limit drags to single touch
            var me = this,
                region = me.getChart().getInnerRegion(),
                xy = me.getChart().element.getXY();
            me.startX = e.pageX - xy[0] - region[0];
            me.startY = e.pageY - xy[1] - region[1];
            me.oldVisibleRanges = null;
            me.hideLabels();
        }
    },

    onPanGesture: function (e) {
        if (!e.touches || e.touches.length < 2) { //Limit drags to single touch
            var me = this,
                region = me.getChart().getInnerRegion(),
                xy = me.getChart().element.getXY();
            if (me.getZoomOnPanGesture()) {
                me.transformAxesBy(me.getZoomableAxes(e), 0, 0, (e.pageX - xy[0] - region[0]) / me.startX, me.startY / (e.pageY - xy[1] - region[1]));
            } else {
                me.transformAxesBy(me.getPannableAxes(e), e.pageX - xy[0] - region[0] - me.startX, e.pageY - xy[1] - region[1] - me.startY, 1, 1);
            }
            me.sync();
        }
    },

    onPanGestureEnd: function (e) {
        var me = this;
        me.showLabels();
        me.sync();
    },

    onGestureStart: function (e) {
        if (e.touches && e.touches.length === 2) {
            var me = this,
                xy = me.getChart().element.getXY(),
                region = me.getChart().getInnerRegion(),
                x = xy[0] + region[0],
                y = xy[1] + region[1],
                newPoints = [e.touches[0].point.x - x, e.touches[0].point.y - y, e.touches[1].point.x - x, e.touches[1].point.y - y],
                xDistance = Math.max(44, Math.abs(newPoints[2] - newPoints[0])),
                yDistance = Math.max(44, Math.abs(newPoints[3] - newPoints[1]));

            me.lastZoomDistances = [xDistance, yDistance];
            me.lastPoints = newPoints;
            me.oldVisibleRanges = null;
            me.hideLabels();
        }
    },

    onGesture: function (e) {
        if (e.touches && e.touches.length === 2) {
            var me = this,
                region = me.getChart().getInnerRegion(),
                xy = me.getChart().element.getXY(),
                x = xy[0] + region[0],
                y = xy[1] + region[1],
                abs = Math.abs,
                lastPoints = me.lastPoints,
                newPoints = [e.touches[0].point.x - x, e.touches[0].point.y - y, e.touches[1].point.x - x, e.touches[1].point.y - y],
                xDistance = Math.max(44, abs(newPoints[2] - newPoints[0])),
                yDistance = Math.max(44, abs(newPoints[3] - newPoints[1])),
                lastDistances = this.lastZoomDistances || [xDistance, yDistance],
                zoomX = xDistance / lastDistances[0],
                zoomY = yDistance / lastDistances[1];

            me.transformAxesBy(me.getZoomableAxes(e),
                region[2] * (zoomX - 1) / 2 + newPoints[2] - lastPoints[2] * zoomX,
                region[3] * (zoomY - 1) / 2 + newPoints[3] - lastPoints[3] * zoomY,
                zoomX,
                zoomY);
            me.sync();
        }

    },

    onGestureEnd: function (e) {
        var me = this;
        me.showLabels();
        me.sync();
    },

    hideLabels: function () {
        if (this.getHideLabelInGesture()) {
            this.eachInteractiveAxes(function (axis) {
                axis.hideLabels();
            });
        }
    },

    showLabels: function () {
        if (this.getHideLabelInGesture()) {
            this.eachInteractiveAxes(function (axis) {
                axis.showLabels();
            });
        }
    },

    isEventOnAxis: function (e, axis) {
        // TODO: right now this uses the current event position but really we want to only
        // use the gesture's start event. Pinch does not give that to us though.
        var region = axis.getSurface().getRegion();
        return region[0] <= e.pageX && e.pageX <= region[0] + region[2] && region[1] <= e.pageY && e.pageY <= region[1] + region[3];
    },

    getPannableAxes: function (e) {
        var me = this,
            axisConfigs = me.getAxes(),
            axes = me.getChart().getAxes(),
            result = [], isEventOnAxis = false,
            config;

        if (e) {
            for (var i = 0; i < axes.length; i++) {
                if (this.isEventOnAxis(e, axes[i])) {
                    isEventOnAxis = true;
                    break;
                }
            }
        }

        for (var i = 0; i < axes.length; i++) {
            config = axisConfigs[axes[i].getPosition()];
            if (config && config.allowPan !== false && (!isEventOnAxis || this.isEventOnAxis(e, axes[i]))) {
                result.push(axes[i]);
            }
        }
        return result;
    },

    getZoomableAxes: function (e) {
        var me = this,
            axisConfigs = me.getAxes(),
            axes = me.getChart().getAxes(),
            result = [],
            isEventOnAxis = false, config;

        if (e) {
            for (var i = 0; i < axes.length; i++) {
                if (this.isEventOnAxis(e, axes[i])) {
                    isEventOnAxis = true;
                    break;
                }
            }
        }

        for (var i = 0; i < axes.length; i++) {
            var axis = axes[i];
            config = axisConfigs[axis.getPosition()];
            if (config && config.allowZoom !== false && (!isEventOnAxis || this.isEventOnAxis(e, axis))) {
                result.push(axis);
            }
        }
        return result;
    },

    eachInteractiveAxes: function (fn) {
        var me = this,
            axisConfigs = me.getAxes(),
            axes = me.getChart().getAxes();
        for (var i = 0; i < axes.length; i++) {
            if (axisConfigs[axes[i].getPosition()]) {
                if (false === fn.call(this, axes[i])) {
                    return;
                }
            }
        }
    },

    transformAxesBy: function (axes, panX, panY, sx, sy) {
        var region = this.getChart().getInnerRegion(),
            oldVisibleRanges = this.oldVisibleRanges;

        if (!oldVisibleRanges) {
            this.oldVisibleRanges = oldVisibleRanges = {};
            this.eachInteractiveAxes(function (axis) {
                oldVisibleRanges[axis.getId()] = axis.getVisibleRange();
            });
        }

        if (!region) {
            return;
        }
        for (var i = 0; i < axes.length; i++) {
            this.transformAxisBy(axes[i], oldVisibleRanges[axes[i].getId()], panX, panY, sx, sy);
        }
    },

    transformAxisBy: function (axis, oldVisibleRange, panX, panY, sx, sy) {
        var me = this,
            visibleLength = oldVisibleRange[1] - oldVisibleRange[0],
            region = me.getChart().getInnerRegion();
        if (!region) {
            return;
        }

        var isSide = axis.isSide(),
            length = isSide ? region[3] : region[2],
            pan = isSide ? -panY : panX;
        visibleLength /= isSide ? sy : sx;
        if (visibleLength < 0) {
            visibleLength = -visibleLength;
        }

        if (visibleLength > 1) {
            visibleLength = 1;
        }

        if (visibleLength < 1e-5) {
            visibleLength = 1e-5;
        }

        axis.setVisibleRange([
            (oldVisibleRange[0] + oldVisibleRange[1] - visibleLength) * 0.5 - pan / length * visibleLength,
            (oldVisibleRange[0] + oldVisibleRange[1] + visibleLength) * 0.5 - pan / length * visibleLength
        ]);
    },

    destroy: function () {
        this.setModeToggleButton(null);
        this.callSuper();
    }
});
