/**
 *
 */
Ext.define("Ext.chart.axis.layout.Layout", {
    config: {
        axis: null
    },

    constructor: function (config) {
        this.initConfig();
    },

    processData: function (series) {
        var me = this,
            axis = me.getAxis(),
            direction = axis.getDirection(),
            boundSeries = axis.boundSeries,
            i, ln, item;
        if (series) {
            series['coordinate' + direction]();
        } else {
            for (i = 0, ln = boundSeries.length; i < ln; i++) {
                item = boundSeries[i];
                if (item['get' + direction + 'Axis']() === axis) {
                    item['coordinate' + direction]();
                }
            }
        }
    },

    calculateMajorTicks: function (context) {
        var me = this,
            attr = context.attr,
            visibleRange = attr.visibleRange,
            range = attr.max - attr.min,
            zoom = range / attr.length * (visibleRange[1] - visibleRange[0]),
            viewMin = attr.min + range * visibleRange[0],
            viewMax = attr.min + range * visibleRange[1],
            estStepSize = attr.estStepSize * zoom,
            out = me.snapEnds(context, attr.min, attr.max, estStepSize);
        if (out) {
            me.trimByRange(context, out, viewMin - zoom * (1 + attr.startGap), viewMax + zoom * (1 + attr.endGap));
            context.majorTicks = out;
        }
    },

    calculateMinorTicks: function (context) {
        // TODO: Finish Minor ticks.
    },

    calculateLayout: function (context) {
        var me = this,
            attr = context.attr,
            majorTicks = attr.majorTicks,
            minorTicks = attr.minorTicks;
        if (attr.length === 0) {
            return null;
        }

        if (majorTicks) {
            this.calculateMajorTicks(context);
            if (minorTicks) {
                this.calculateMinorTicks(context);
            }
        }
    },

    /**
     *
     * @param context
     * @param min
     * @param max
     * @param estStepSize
     */
    snapEnds: Ext.emptyFn,

    /**
     *
     * @param context
     * @param out
     * @param trimMin
     * @param trimMax
     */
    trimByRange: function (context, out, trimMin, trimMax) {
        var segmenter = context.segmenter,
            unit = out.unit,
            beginIdx = segmenter.diff(out.from, trimMin, unit),
            endIdx = segmenter.diff(out.from, trimMax, unit),
            begin = Math.max(0, Math.ceil(beginIdx / out.step)),
            end = Math.min(out.steps, Math.floor(endIdx / out.step));

        if (end < out.steps) {
            out.to = segmenter.add(out.from, end * out.step, unit);
        }

        if (out.max > trimMax) {
            out.max = out.to;
        }

        if (out.from < trimMin) {
            out.from = segmenter.add(out.from, begin * out.step, unit);
            while (out.from < trimMin) {
                begin++;
                out.from = segmenter.add(out.from, out.step, unit);
            }
        }

        if (out.min < trimMin) {
            out.min = out.from;
        }

        out.steps = end - begin;
    }
});