/**
 * Manages an animation Pool.
 *
 * An animation descriptor can be registered in the pool. An animation descriptor
 * is an object with a `step` method. If it is also an observable, its `animationstart`
 * and `animationend` events are fired on that descriptor.
 */
Ext.define('Ext.draw.fx.Pool', {
    singleton: true,

    animations: [],

    /**
     * Adds an animation to the pool.
     *
     * @param {Object} animation The animation descriptor to add to the pool.
     */
    add: function (animation) {
        if (!this.contains(animation)) {
            this.animations.push(animation);
            Ext.draw.fx.Frame.ignite();
            if ('fireEvent' in animation) {
                animation.fireEvent('animationstart', animation);
            }
        }
    },

    /**
     * Removes an animation from the pool.
     * TODO: This is broken when called within `refresh` method.
     * @param {Object} animation The animation to remove from the pool.
     */
    remove: function (animation) {
        var me = this,
            animations = me.animations,
            i = 0,
            l = animations.length;

        for (; i < l; ++i) {
            if (animations[i] === animation) {
                animations.splice(i, 1);
                return;
            }
        }
    },

    /**
     * Returns `true` or `false` whether it contains the given animation or not.
     *
     * @param {Object} animation The animation to check for.
     * @return {Boolean}
     */
    contains: function (animation) {
        return this.animations.indexOf(animation) > -1;
    },

    /**
     * Returns `true` or `false` whether the pool is empty or not.
     * @return {Boolean}
     */
    empty: function () {
        return this.animations.length === 0;
    },

    /**
     * Given a frame time it will filter out finished animations from the pool.
     *
     * @param {Number} frameTime The frame's start time, in milliseconds.
     */
    refresh: function (frameTime) {
        var me = this,
        // TODO: Try to find a way to get rid of this copy
            animations = me.animations.slice(),
            animation,
            i = 0, j = 0,
            l = animations.length;

        for (; i < l; ++i) {
            animation = animations[i];
            animation.step(frameTime);
            if (animation.animating) {
                animations[j++] = animation;
            } else if (animation.fireEvent) {
                me.animations.splice(j, 1);
                animation.fireEvent('animationend');
            }
        }
    }
});

