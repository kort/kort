/**
 * Animation modifier.
 *
 * TODO: Finish documentation
 */
Ext.define("Ext.draw.modifier.Animation", {
    mixins: {
        observable: 'Ext.mixin.Observable'
    },
    requires: [
        'Ext.draw.fx.TimingFunctions'
    ],
    extend: 'Ext.draw.modifier.Modifier',
    alias: 'modifier.animation',

    config: {
        /**
         * @cfg {Function} easing
         * Default easing function.
         */
        easing: function (x) {
            return x;
        },

        /**
         * @cfg {Number} duration
         * Default duration time (ms).
         */
        duration: 0,
        specialEasings: {},
        specialDuration: {}
    },

    constructor: function () {
        this.callSuper(arguments);
        this.animating = 0;
        this.animatingPool = [];
        this.anyAnimation = false;
        this.anySpecialAnimations = false;
    },

    prepareAttributes: function (attr) {
        if (!attr.hasOwnProperty('timers')) {
            attr.animating = false;
            attr.timers = {};
            attr.animationOriginal = Ext.Object.chain(attr);
            attr.animationOriginal.upperLevel = attr;
        }
        if (this._previous) {
            this._previous.prepareAttributes(attr.animationOriginal);
        }
    },

    updateDuration: function (duration) {
        this.anyAnimation = duration > 0;
    },

    setAnimating: function (attributes, animating) {
        var me = this,
            i, j;

        if (attributes.animating !== animating) {
            attributes.animating = animating;
            if (animating) {
                me.animatingPool.push(attributes);
                if (me.animating === 0) {
                    Ext.draw.fx.Pool.add(me);
                }
                me.animating++;
            } else {
                for (i = 0, j = 0; i < me.animatingPool.length; i++) {
                    if (me.animatingPool[i] !== attributes) {
                        me.animatingPool[j++] = me.animatingPool[i];
                    }
                }
                me.animating = me.animatingPool.length = j;
            }
        }
    },

    applyEasing: function (easing) {
        if (typeof easing === 'string') {
            return Ext.draw.fx.TimingFunctions.EasingMap[easing];
        } else {
            return easing;
        }
    },

    applySpecialEasings: function (newSpecialEasing, oldSpecialEasing) {
        oldSpecialEasing = oldSpecialEasing || {};
        var attr, attrs, easing, i, ln;

        for (attr in newSpecialEasing) {
            easing = newSpecialEasing[attr];
            attrs = attr.split(',');
            if (typeof easing === 'string') {
                easing = Ext.draw.fx.TimingFunctions.EasingMap[easing];
            }
            for (i = 0, ln = attrs.length; i < ln; i++) {
                oldSpecialEasing[attrs[i]] = easing;
            }
        }
        return oldSpecialEasing;
    },

    setEasingOn: function (attrs, easing) {
        attrs = Ext.Array.from(attrs).slice();
        var specialEasing = {},
            i = 0,
            ln = attrs.length;

        for (; i < ln; i++) {
            specialEasing[attrs[i]] = easing;
        }
        this.setSpecialEasings(specialEasing);
    },

    clearEasingOn: function (attrs) {
        attrs = Ext.Array.from(attrs, true);
        var i = 0, ln = attrs.length;
        for (; i < ln; i++) {
            delete this._specialEasing[attrs[i]];
        }
    },

    applySpecialDuration: function (newSpecialDuration, oldSpecialDuration) {
        oldSpecialDuration = oldSpecialDuration || {};
        var attr, duration, attrs, i, ln, anySpecialAnimations = this.anySpecialAnimations;

        for (attr in newSpecialDuration) {
            duration = newSpecialDuration[attr];
            attrs = attr.split(',');
            anySpecialAnimations = true;
            
            for (i = 0, ln = attrs.length; i < ln; i++) {
                oldSpecialDuration[attrs[i]] = duration;
            }
        }
        this.anySpecialAnimations = anySpecialAnimations;
        return oldSpecialDuration;
    },

    setDurationOn: function (attrs, duration) {
        attrs = Ext.Array.from(attrs).slice();
        var specialDurations = {},
            i = 0,
            ln = attrs.length;

        for (; i < ln; i++) {
            specialDurations[attrs[i]] = duration;
        }
        this.setSpecialDuration(specialDurations);
    },
    
    clearDurationOn: function (attrs) {
        attrs = Ext.Array.from(attrs, true);
        var i = 0, ln = attrs.length;

        for (; i < ln; i++) {
            delete this._specialDuration[attrs[i]];
        }
    },

    /**
     * Set the attr with given easing and duration.
     * @param {Object} attr The attributes collection.
     * @param {Object} changes The changes that popped up from lower modifier.
     * @return {Object} The changes to pop up.
     */
    setAttrs: function (attr, changes) {
        var timers = attr.timers,
            parsers = this._sprite.self.def._animationProcessors,
            defaultEasing = this._easing,
            defaultDuration = this._duration,
            specialDuration = this._specialDuration,
            specialEasings = this._specialEasings,
            anySpecial = this.anySpecialAnimations,
            any = this.anyAnimation || anySpecial,
            original = attr.animationOriginal,
            ignite = false,
            timer, name, newValue, startValue, parser, easing, duration;

        if (!any) {
            // If there is no animation enabled
            // When applying changes to attributes, simply stop current animation
            // and set the value.
            for (name in changes) {
                if (attr[name] === changes[name]) {
                    delete changes[name];
                }
                delete timers[name];
            }
            return changes;
        } else {
            // If any animation
            for (name in changes) {
                newValue = changes[name];
                startValue = attr[name];
                if (newValue !== startValue && any && startValue !== undefined && startValue !== null && (parser = parsers[name])) {
                    // If this property is animating.

                    // Figure out the desired duration and easing.
                    easing = defaultEasing;
                    duration = defaultDuration;
                    if (anySpecial) {
                        // Deducing the easing function and duration
                        if (name in specialEasings) {
                            easing = specialEasings[name];
                        }
                        if (name in specialDuration) {
                            duration = specialDuration[name];
                        }
                    }

                    // If the property is animating
                    if (duration) {
                        if (!timers[name]) {
                            timers[name] = {};
                        }

                        timer = timers[name];
                        timer.start = 0;
                        timer.easing = easing;
                        timer.duration = duration;
                        timer.compute = parser.compute;
                        timer.serve = parser.serve || Ext.draw.Draw.reflectFn;

                        if (parser.parseInitial) {
                            var initial = parser.parseInitial(startValue, newValue);
                            timer.source = initial[0];
                            timer.target = initial[1];
                        } else if (parser.parse) {
                            timer.source = parser.parse(startValue);
                            timer.target = parser.parse(newValue);
                        } else {
                            timer.source = startValue;
                            timer.target = newValue;
                        }
                        // The animation started. Change to originalVal.
                        timers[name] = timer;
                        original[name] = newValue;
                        delete changes[name];
                        ignite = true;
                        continue;
                    } else {
                        delete original[name];
                    }
                } else {
                    delete original[name];
                }

                // If the property is not animating.
                delete timers[name];
            }
        }

        if (ignite && !attr.animating) {
            this.setAnimating(attr, true);
        }

        return changes;
    },

    /**
     * Update attributes to current value according to current animation time.
     * This method will not effect the values of lower layers, but may delete a
     * value from it.
     * @param attr
     * @return {Object} the changes to popup.
     */
    updateAttributes: function (attr) {
        if (!attr.animating) {
            return {};
        }
        var changes = {}, change,
            any = false,
            original = attr.animationOriginal,
            timers = attr.timers,
            now = Ext.draw.fx.Frame.animationTime(),
            name, timer, delta;

        // If updated in the same frame, return.
        if (attr.lastUpdate === now) {
            return {};
        }

        for (name in timers) {
            timer = timers[name];
            if (!timer.start) {
                timer.start = now;
            }
            delta = (now - timer.start) / timer.duration;
            if (delta >= 1) {
                changes[name] = original[name];
                delete original[name];
                delete timers[name];
            } else {
                changes[name] = timer.serve(timer.compute(timer.source, timer.target, timer.easing(delta), attr[name]));
                any = true;
            }
        }
        attr.lastUpdate = now;
        this.setAnimating(attr, any);
        return changes;
    },

    pushDown: function (attr, changes) {
        changes = Ext.draw.modifier.Modifier.prototype.pushDown.call(this, attr.animationOriginal, changes);
        return this.setAttrs(attr, changes);
    },

    popUp: function (attr, changes) {
        attr = attr.upperLevel;
        changes = this.setAttrs(attr, changes);
        if (this._next) {
            return this._next.popUp(attr, changes);
        } else {
            return Ext.apply(attr, changes);
        }
    },

    step: function () {
        var me = this,
            pool = me.animatingPool.slice(),
            i, ln;

        for (i = 0, ln = pool.length; i < ln; i++) {
            me.stepAttributes(pool[i]);
        }
    },

    stepAttributes: function (attributes) {
        var changes = this.updateAttributes(attributes),
            name;

        // Looking for anything in changes
        //noinspection LoopStatementThatDoesntLoopJS
        for (name in changes) {
            if (this._next) {
                this._next.popUp(attributes, changes);
            }
            break;
        }
    }
});