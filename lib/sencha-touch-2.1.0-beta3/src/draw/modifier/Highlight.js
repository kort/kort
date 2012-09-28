/**
 * Highlight modifier is a modifier that will override the attributes
 * with its `highlightStyle` attributes when its `highlighted` is true.
 */
Ext.define("Ext.draw.modifier.Highlight", {
    extend: 'Ext.draw.modifier.Modifier',
    alias: 'modifier.highlight',
    config: {
        enabled: false,
        highlightStyle: {}
    },

    applyHighlightStyle: function (style, oldStyle) {
        oldStyle = oldStyle || {};
        if (this.getSprite()) {
            Ext.apply(oldStyle, this.getSprite().self.def.normalize(style));
        }
        return oldStyle;
    },

    updateSprites: function (sprite, oldSprite) {
        if (sprite) {
            if (this.getHighlightStyle()) {
                this._style = sprite.self.def.normalize(this.getHighlightStyle());
            }
        }
    },

    prepareAttributes: function (attr) {
        if (!attr.hasOwnProperty('highlightOriginal')) {
            attr.highlighted = false;
            attr.highlightOriginal = Ext.Object.chain(attr);
        }
        if (this._previous) {
            this._previous.prepareAttributes(attr.highlightOriginal);
        }
    },

    filterChanges: function (attr, changes) {
        var me = this,
            name,
            original = attr.highlightOriginal,
            style = me.getHighlightStyle();
        if (attr.highlighted) {
            for (name in changes) {
                if (style.hasOwnProperty(name)) {
                    // If it's highlighted, then save the changes to lower level
                    // on overridden attributes.
                    original[name] = changes[name];
                    delete changes[name];
                }
            }
        }

        return changes;
    },

    pushDown: function (attr, changes) {
        var style = this.getHighlightStyle(),
            original = attr.highlightOriginal,
            oldHighlighted, name;

        if (changes.hasOwnProperty('highlighted')) {
            oldHighlighted = changes.highlighted;

            // Hide `highlighted` and `highlightStyle` to underlying modifiers.
            delete changes.highlighted;

            if (this._previous) {
                changes = this._previous.pushDown(original, changes);
            }
            changes = this.filterChanges(attr, changes);

            if (oldHighlighted !== attr.highlighted) {
                if (oldHighlighted) {
                    // switching on
                    // At this time, original should be empty.
                    for (name in style) {
                        // If changes[name] just changed the value in lower levels,
                        if (name in changes) {
                            original[name] = changes[name];
                        } else {
                            original[name] = attr[name];
                        }
                        if (original[name] !== style[name]) {
                            changes[name] = style[name];
                        }
                    }
                } else {
                    // switching off
                    for (name in style) {
                        if (!(name in changes)) {
                            changes[name] = original[name];
                        }
                        delete original[name]; // TODO: Need deletion API?
                    }
                }
                changes.highlighted = oldHighlighted;
            }
        } else {
            if (this._previous) {
                changes = this._previous.pushDown(original, changes);
            }
            changes = this.filterChanges(attr, changes);
        }

        return changes;
    },

    popUp: function (attr, changes) {
        changes = this.filterChanges(attr, changes);
        Ext.draw.modifier.Modifier.prototype.popUp.call(this, attr, changes);
    },

    beforeAttach: function (sprite) {
        // Before attaching to a sprite, register the highlight related
        // attributes to its definition.
        //
        // TODO(zhangbei): Unfortunately this will effect all the sprites of the same type.
        // As the redundant attributes would not effect performance, it is not yet a big problem.
        var def = sprite.self.def;
        this.setSprite(sprite);
        def.setConfig({
            defaults: {
                highlighted: false
            },

            processors: {
                highlighted: 'bool'
            },

            aliases: {
                "highlight": "highlighted",
                "highlighting": "highlighted"
            },

            dirtyFlags: {
            },

            updaters: {

            }
        });
    }
});