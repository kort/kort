(function() {
    if (!Ext.global.Float32Array) {
        // Typed Array polyfill
        var Float32Array = function (array) {
            if (typeof array === 'number') {
                this.length = array;
            } else if ('length' in array) {
                this.length = array.length;
                for (var i = 0, len = array.length; i < len; i++) {
                    this[i] = +array[i];
                }
            }
        };

        Float32Array.prototype = [];
        Ext.global.Float32Array = Float32Array;
    }
})();

/**
 * Utility class providing mathematics functionalities through all the draw package.
 */
Ext.define('Ext.draw.Draw', {

    singleton: true,

    requires: ['Ext.draw.Color', 'Ext.draw.fx.Frame', 'Ext.draw.Matrix'],
    stopsRE: /^(\d+%?)$/,
    pathRe: /,?([achlmqrstvxz]),?/gi,
    pathSplitRe: /\s|,/g,
    radian: Math.PI / 180,
    pi2: Math.PI * 2,
    snapEndsIntervalWeights: [
        [0, 15],
        [20, 4],
        [30, 2],
        [40, 4],
        [50, 9],
        [60, 4],
        [70, 2],
        [80, 4],
        [100, 15]
    ],

    /**
     * Function that returns its first element.
     * @param {Mixed} a
     * @return {Mixed}
     */
    reflectFn: function (a) {
        return a;
    },

    /**
     * Determine whether p1 is at the left-hand side of p2 to p3.
     * 
     * @param {Array} p1
     * @param {Array} p2
     * @param {Array} p3
     * @return {Boolean}
     */
    intersectInside: function (p1, p2, p3) {
        return (p3[0] - p2[0]) * (p1[1] - p2[1]) > (p3[1] - p2[1]) * (p1[0] - p2[0]);
    },

    intersectIntersection: function (s, e, cp1, cp2) {
        var p = [],
            dcx = cp1[0] - cp2[0],
            dcy = cp1[1] - cp2[1],
            dpx = s[0] - e[0],
            dpy = s[1] - e[1],
            n1 = cp1[0] * cp2[1] - cp1[1] * cp2[0],
            n2 = s[0] * e[1] - s[1] * e[0],
            n3 = 1 / (dcx * dpy - dcy * dpx);

        p[0] = (n1 * dpx - n2 * dcx) * n3;
        p[1] = (n1 * dpy - n2 * dcy) * n3;
        return p;
    },

    intersect: function (subjectPolygon, clipPolygon) {
        var me = this,
            i = 0,
            ln = clipPolygon.length,
            cp1 = clipPolygon[ln - 1],
            outputList = subjectPolygon,
            cp2, s, e, ln2, inputList, j;

        for (; i < ln; ++i) {
            cp2 = clipPolygon[i];
            inputList = outputList;
            outputList = [];
            s = inputList[inputList.length - 1];
            j = 0;
            ln2 = inputList.length;
            for (; j < ln2; j++) {
                e = inputList[j];
                if (me.intersectInside(e, cp1, cp2)) {
                    if (!me.intersectInside(s, cp1, cp2)) {
                        outputList.push(me.intersectIntersection(s, e, cp1, cp2));
                    }
                    outputList.push(e);
                }
                else if (me.intersectInside(s, cp1, cp2)) {
                    outputList.push(me.intersectIntersection(s, e, cp1, cp2));
                }
                s = e;
            }
            cp1 = cp2;
        }
        return outputList;
    },

    /**
     * Return the distance between two points.
     * @param {Array} p1 First point
     * @param {Array} p2 Second point
     * @return {Number}
     */
    distance: function (p1, p2) {
        var dx = p1[0] - p2[0],
            dy = p1[1] - p2[1];

        return Math.sqrt(dx * dx + dy * dy);
    },

    /**
     * snapEnds is a utility function that gives you axis ticks information based on start, end
     * and preferred number of steps. It happens quite often that you have just a dataset and need to
     * build an axis. If you simply take min and max and divide delta to number of steps you could get
     * very ugly numbers. Lets say you have min = 0.532 and max = 0.823 and you want to draw axis
     * across 20 steps. Simple calculation like (max - min) / steps will give us: 0.014549(9), so
     * your axis will look like this:
     *
     *     0.532, 0.5465499, 0.5610998, 0.5756497, etc
     *
     * Not pretty at all. snapEnds will give different set of numbers for the same values:
     *
     *     0.5, 0.52, 0.54, 0.56, 0.58, 0.6, 0.62, ... 0.8, 0.82, 0.84
     *
     * It starts a bit earlier and ends a bit later and trying to find a step which will look nice.
     *
     * @param {Number} from The minimum value in the data.
     * @param {Number} to The maximum value in the data.
     * @param {Number} stepsMax The maximum number of ticks.
     * @param {Boolean} endsLocked If `true`, the `from` and `to` parameters will be used as fixed end values
     * and will not be adjusted.
     * @return {Object} The calculated step and ends info; properties are:
     * 
     * - `from`: The result start value, which may be lower than the original start value.
     * - `to`: The result end value, which may be higher than the original end value.
     * - `power`: The power of 10 used in the step calculation.
     * - `step`: The value size of each step.
     * - `steps`: The number of steps. **NOTE**: the steps may not divide the from/to range perfectly evenly;
     * there may be a smaller distance between the last step and the end value than between prior
     * steps, particularly when the `endsLocked` param is true. Therefore it is best to not use
     * the `steps` result when finding the axis tick points, instead use the `step`, `to`, and
     * `from` to find the correct point for each tick.
     */
    snapEnds: function (from, to, stepsMax, endsLocked) {
        if (Ext.isDate(from)) {
            return this.snapEndsByDate(from, to, stepsMax, endsLocked);
        }
        var math = Math,
            pow = math.pow,
            floor = math.floor,

        // start with a precise step size
            step = (to - from) / stepsMax,

        // power is a power of 10 of the step. For axis 1, 2, 3 or 10, 20, 30 or
        // 0.1, 0.2, 0.3 power will be 0, 1 and -1 respectively.
            power = floor(math.log(step) / math.LN10) + 1,
            tenToPower = pow(10, power),

        // modulo will translate rounded value of the step to the 0 - 100 range. We will need it later.
            modulo = math.round((step % tenToPower) * pow(10, 2 - power)),

        // interval is an array of value/weight pairs
            interval = Ext.draw.Draw.snapEndsIntervalWeights,
            ln = interval.length,
            stepCount = 0,
            topWeight = 1e9,
            cur, value, weight, i, topValue, stepCount2;

        // round the start value by the power, so e.g. 0.532 will become 0.5.
        if (!endsLocked) {
            from = floor(from / tenToPower) * tenToPower;
        }
        cur = from;

        // find what is our step going to be to be closer to "pretty" numbers. This is done taking into
        // account the interval weights. This way we figure out topValue.
        for (i = 0; i < ln; i++) {
            value = interval[i][0];
            weight = (value - modulo) < 0 ? 1e6 : (value - modulo) / interval[i][1];
            if (weight < topWeight) {
                topValue = value;
                topWeight = weight;
            }
        }

        // with the new topValue, calculate the final step size
        step = floor(step * pow(10, -power)) * pow(10, power) + topValue * pow(10, power - 2);
        stepCount2 = Math.ceil((to - cur) / step);
        stepCount += stepCount2;
        cur += stepCount2 * step;

        // Cut everything that is after tenth digit after floating point. This is to get rid of
        // rounding errors, i.e. 12.00000000000121212.
        if (!endsLocked) {
            to = +cur.toFixed(10);
        }

        return {
            from: from,
            to: to,
            power: power,
            step: step,
            steps: stepCount
        };
    },

    /**
     * snapEndsByDate is a utility method to deduce an appropriate tick configuration for the data set of given
     * feature. Refer to {@link #snapEnds}.
     *
     * @param {Date} from The minimum value in the data.
     * @param {Date} to The maximum value in the data.
     * @param {Number} stepsMax The maximum number of ticks.
     * @param {Boolean} lockEnds If true, the 'from' and 'to' parameters will be used as fixed end values
     * and will not be adjusted.
     * @return {Object} The calculated step and ends info; properties are:
     * 
     * - from: The result start value, which may be lower than the original start value.
     * - to: The result end value, which may be higher than the original end value.
     * - step: The value size of each step.
     * - steps: The number of steps. **NOTE**: the steps may not divide the from/to range perfectly evenly;
     * there may be a smaller distance between the last step and the end value than between prior
     * steps, particularly when the `endsLocked` param is true. Therefore it is best to not use
     * the `steps` result when finding the axis tick points, instead use the `step`, `to`, and
     * `from` to find the correct point for each tick.
     */
    snapEndsByDate: function (from, to, stepsMax, lockEnds) {
        var selectedStep = false,
            scales = [
                [Ext.Date.MILLI, [1, 2, 3, 5, 10, 20, 30, 50, 100, 200, 300, 500]],
                [Ext.Date.SECOND, [1, 2, 3, 5, 10, 15, 30]],
                [Ext.Date.MINUTE, [1, 2, 3, 5, 10, 20, 30]],
                [Ext.Date.HOUR, [1, 2, 3, 4, 6, 12]],
                [Ext.Date.DAY, [1, 2, 3, 7, 14]],
                [Ext.Date.MONTH, [1, 2, 3, 4, 6]]
            ],
            ln = scales.length,
            i, j, scale, scale1Ln, yearDiff;

        // Find the most desirable scale
        for (i = 0; i < ln; i++) {
            scale = scales[i];
            scale1Ln = scale[1].length;
            for (j = 0; j < scale1Ln; j++) {
                if (to < Ext.Date.add(from, scale[0], scale[1][j] * stepsMax)) {
                    selectedStep = [scale[0], scale[1][j]];
                    return false;
                }
            }
        }

        if (!selectedStep) {
            yearDiff = this.snapEnds(from.getFullYear(), to.getFullYear() + 1, stepsMax, lockEnds);
            selectedStep = [Ext.Date.YEAR, Math.round(yearDiff.step)];
        }
        return this.snapEndsByDateAndStep(from, to, selectedStep, lockEnds);
    },

    /**
     * `snapEndsByDateAndStep()` is a utility method to deduce an appropriate tick configuration for the data set of given
     * feature and specific step size.
     * @param {Date} from The minimum value in the data.
     * @param {Date} to The maximum value in the data.
     * @param {Array} step An array with two components: The first is the unit of the step (day, month, year, etc). The second one is the number of units for the step (1, 2, etc.).
     * @param {Boolean} lockEnds If `true`, the `from` and `to` parameters will be used as fixed end values
     * and will not be adjusted.
     */
    snapEndsByDateAndStep: function (from, to, step, lockEnds) {
        var fromStat = [from.getFullYear(), from.getMonth(), from.getDate(), from.getHours(), from.getMinutes(), from.getSeconds(), from.getMilliseconds()],
            steps = 0,
            testFrom, testTo, minSteps, maxSteps, midSteps;

        if (lockEnds) {
            testFrom = from;
        } else {
            switch (step[0]) {
                case Ext.Date.MILLI:
                    testFrom = new Date(fromStat[0], fromStat[1], fromStat[2], fromStat[3],
                        fromStat[4], fromStat[5], Math.floor(fromStat[6] / step[1]) * step[1]);
                    break;
                case Ext.Date.SECOND:
                    testFrom = new Date(fromStat[0], fromStat[1], fromStat[2], fromStat[3],
                        fromStat[4], Math.floor(fromStat[5] / step[1]) * step[1], 0);
                    break;
                case Ext.Date.MINUTE:
                    testFrom = new Date(fromStat[0], fromStat[1], fromStat[2], fromStat[3],
                        Math.floor(fromStat[4] / step[1]) * step[1], 0, 0);
                    break;
                case Ext.Date.HOUR:
                    testFrom = new Date(fromStat[0], fromStat[1], fromStat[2],
                        Math.floor(fromStat[3] / step[1]) * step[1], 0, 0, 0);
                    break;
                case Ext.Date.DAY:
                    testFrom = new Date(fromStat[0], fromStat[1],
                        Math.floor((fromStat[2] - 1) / step[1]) * step[1] + 1, 0, 0, 0, 0);
                    break;
                case Ext.Date.MONTH:
                    testFrom = new Date(fromStat[0], Math.floor(fromStat[1] / step[1]) * step[1], 1, 0, 0, 0, 0);
                    break;
                default: // Ext.Date.YEAR
                    testFrom = new Date(Math.floor(fromStat[0] / step[1]) * step[1], 0, 1, 0, 0, 0, 0);
                    break;
            }
        }

        testTo = testFrom;

        if (lockEnds) {
            testTo = to;
        } else {
            steps = step[1];
            minSteps = 1;
            maxSteps = 1;
            while (+Ext.Date.add(testTo, step[0], steps * maxSteps) < +to) { // stop when testTo >= to
                maxSteps += maxSteps;
            }
            while (minSteps + 1 < maxSteps) {
                midSteps = Math.floor((minSteps + maxSteps) * 0.5);
                if (+Ext.Date.add(testTo, step[0], steps * midSteps) <= +to) {
                    minSteps = midSteps;
                } else {
                    maxSteps = midSteps;
                }
            }
            while (Ext.Date.add(testTo, step[0], steps * minSteps) < to) {
                minSteps++;
            }
            testTo = Ext.Date.add(testTo, step[0], steps * minSteps);
            steps *= minSteps;
        }
        return {
            from: +testFrom,
            to: +testTo,
            step: (testTo - testFrom) / steps,
            steps: steps
        };
    },

    sorter: function (a, b) {
        return a.offset - b.offset;
    },

    /**
     * Converting degrees to radians.
     * @param {Number} degrees
     * @return {Number}
     */
    rad: function (degrees) {
        return degrees % 360 * Math.PI / 180;
    },

    /**
     * Converting radians to degrees.
     * @param {Number} radian
     * @return {Number}
     */
    degrees: function (radian) {
        return radian * 180 / Math.PI % 360;
    },

    isBBoxIntersect: function (bbox1, bbox2) {
        return (Math.max(bbox1.x, bbox2.x) > Math.min(bbox1.x + bbox1.width, bbox2.x + bbox2.width)) ||
            (Math.max(bbox1.y, bbox2.y) > Math.min(bbox1.y + bbox1.height, bbox2.y + bbox2.height));
    },

    /**
     * @method
     * @private
     * Work around for iOS.
     * Nested 3d-transforms seems to prevent the redraw inside it until some event is fired.
     */
    updateIOS: Ext.os.is.iOS ? function () {
        Ext.getBody().createChild({id: 'frame-workaround', style: 'position: absolute; top: 0px; bottom: 0px; left: 0px; right: 0px; background: rgba(0,0,0,0.001); z-index: 100000'});
        Ext.draw.fx.Frame.schedule(function () {Ext.get('frame-workaround').destroy();});
    } : Ext.emptyFn
});
