/**
 * Frame by frame based animation. Will use `requestAnimationFrame` or timer based animations.
 *
 * Example code:
 *
 *     var fx = Ext.create('Ext.draw.fx.Frame', {
 *         duration: 1000,
 *
 *         onCompute: function(from, to, delta) {
 *             console.log(Ext.draw.fx.Frame.compute(from, to, delta));
 *         },
 *
 *         onComplete: function() {
 *             console.log('animation ended!');
 *         }
 *     });
 *
 *     fx.setFrom(0);
 *     fx.setTo(10);
 *
 *     fx.start();
 */
Ext.define('Ext.draw.fx.Frame', {
    uses: ['Ext.draw.Draw'],
    requires: ['Ext.draw.fx.Pool'],
    singleton: true,

    //Handle frame by frame callbacks.
    //I don't see a better way of doing this since I can't
    //integrate Observable as static methods for a non-singleton class.

    _frameCallbacks: {},
    _frameCallbackId: 0,
    scheduled: 0,
    frameStartTimeOffset: Ext.frameStartTime,

    schedule: function (callback, scope) {
        scope = scope || this;
        var id = 'frameCallback' + (this._frameCallbackId++);

        if (Ext.isString(callback)) {
            callback = scope[callback];
        }
        Ext.draw.fx.Frame._frameCallbacks[id] = {fn: callback, scope: scope, once: true};
        this.scheduled++;
        Ext.draw.fx.Frame.ignite();
        return id;
    },

    cancel: function (id) {
        if (Ext.draw.fx.Frame._frameCallbacks[id] && Ext.draw.fx.Frame._frameCallbacks[id].once) {
            this.scheduled--;
            delete Ext.draw.fx.Frame._frameCallbacks[id];
        }
    },

    addFrameCallback: function (callback, scope) {
        scope = scope || this;
        if (Ext.isString(callback)) {
            callback = scope[callback];
        }
        var id = 'frameCallback' + (this._frameCallbackId++);

        Ext.draw.fx.Frame._frameCallbacks[id] = {fn: callback, scope: scope};
        return id;
    },

    removeFrameCallback: function (id) {
        delete Ext.draw.fx.Frame._frameCallbacks[id];
    },

    fireFrameCallbacks: function () {
        var callbacks = this._frameCallbacks,
            once = [],
            id, i, ln, fn, cb;

        for (id in callbacks) {
            cb = callbacks[id];
            fn = cb.fn;
            if (Ext.isString(fn)) {
                fn = cb.scope[fn];
            }
            fn.call(cb.scope);
            if (cb.once) {
                once.push(id);
            }
        }
        for (i = 0, ln = once.length; i < ln; i++) {
            this.scheduled--;
            delete callbacks[once[i]];
        }
    },

    /* A basic linear interpolation function. */
    compute: function (from, to, delta) {
        return from + (to - from) * delta;
    },

    /**
     *  Cross browser `animationTime` implementation.
     *  @return {Number}
     */
    animationTime: function () {
        return Ext.frameStartTime - this.frameStartTimeOffset;
    }
}, function () {
    //Initialize the endless animation loop.
    var looping = false,
        animationPool = Ext.draw.fx.Pool,
        frame = Ext.draw.fx.Frame,
        requestAnimationFramePolyfill = (function (global) {
            return global.requestAnimationFrame ||
                global.webkitRequestAnimationFrame ||
                global.mozAnimationFrame ||
                global.oAnimationFrame ||
                global.msAnimationFrame ||
                function (callback) { setTimeout(callback, 1); };
        })(Ext.global),
        animationStartTimePolyfill = (function (global) {
            return (global.animationStartTime ? function () { return global.animationStartTime; } : null) ||
                (global.webkitAnimationStartTime ? function () { return global.webkitAnimationStartTime; } : null) ||
                (global.mozAnimationStartTime ? function () { return global.mozAnimationStartTime; } : null) ||
                (global.oAnimationStartTime ? function () { return global.oAnimationStartTime; } : null) ||
                (global.msAnimationStartTime ? function () { return global.msAnimationStartTime; } : null) ||
                (Date.now ? function () { return Date.now(); } :
                    function () { return +new Date(); });

        })(Ext.global);
    // <debug>
    var startLooping, frames;
    // </debug>
    function loop() {
        Ext.frameStartTime = animationStartTimePolyfill();

        // <debug>
        if (startLooping === undefined) {
            startLooping = Ext.frameStartTime;
        }
        // </debug>
        animationPool.refresh(Ext.frameStartTime);
        frame.fireFrameCallbacks();
        if (frame.scheduled || !animationPool.empty()) {
            requestAnimationFramePolyfill(loop);
            // <debug>
            frames++;
            // </debug>
        } else {
            looping = false;
            // <debug>
            startLooping = undefined;
            // </debug>
        }
        // <debug>
        frame.framerate = frames * 1000 / (frame.animationTime() - startLooping);
        // </debug>

    }

    // <debug>
    frame.clearCounter = function () {
        startLooping = frame.animationTime();
        frames = 0;
    };
    // </debug>

    frame.ignite = function () {
        if (!looping) {
            // <debug>
            frames = 0;
            // </debug>
            looping = true;
            requestAnimationFramePolyfill(loop);
            Ext.draw.Draw.updateIOS();
        }
    };

});
