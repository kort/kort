/**
 * Each sprite has a stack of modifier. The resulting attributes of sprite is
 * the content of the stack top. When setting attributes to a sprite,
 * changes will be pushed-down though the stack of modifiers and pop-back the
 * additive changes; When modifier is triggered to change the attribute of a
 * sprite, it will pop-up the changes to the top.
 */
Ext.define("Ext.draw.modifier.Modifier", {
    config: {
        /**
         * @cfg {Ext.draw.modifier.Modifier} previous Previous modifier that receives
         * the push-down changes.
         */
        previous: null,

        /**
         * @cfg {Ext.draw.modifier.Modifier} next Next modifier that receives the
         * pop-up changes.
         */
        next: null,

        /**
         * @cfg {Ext.draw.sprite.Sprite} sprite Sprite to bind
         */
        sprite: null
    },

    constructor: function (config) {
        this.initConfig(config);
    },

    updateNext: function (next) {
        if (next) {
            next.setPrevious(this);
        }
    },

    /**
     * Validate attribute set before use.
     * 
     * @param {Object} attr The attribute to be validated. Note that it may be already initialized, so do
     * not override properties that has already be used.
     */
    prepareAttributes: function (attr) {
        if (this._previous) {
            this._previous.prepareAttributes(attr);
        }
    },

    popUp: function (attributes, changes) {
        if (this._next) {
            this._next.popUp(attributes, changes);
        } else {
            Ext.apply(attributes, changes);
        }
    },

    /**
     * 
     * @param attr
     * @param {Object} changes The changes to make. This object might be changed unexpectedly inside the method. 
     * @return {Mixed}
     */
    pushDown: function (attr, changes) {
        if (this._previous) {
            return this._previous.pushDown(attr, changes);
        } else {
            for (var name in changes) {
                if (changes[name] === attr[name]) {
                    delete changes[name];
                }
            }
            return changes;
        }
    },

    beforeAttach: function (sprite) {

    }
});