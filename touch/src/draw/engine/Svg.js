/**
 * SVG engine.
 */
Ext.define('Ext.draw.engine.Svg', {
    extend: 'Ext.draw.Surface',
    requires: ['Ext.draw.engine.SvgContext'],

    statics: {
        BBoxTextCache: {}
    },

    getElementConfig: function () {
        return {
            reference: 'element',
            style: {
                position: 'absolute'
            },
            children: [
                {
                    reference: 'innerElement',
                    style: {
                        width: '100%',
                        height: '100%',
                        position: 'relative'
                    },
                    children: [
                        {
                            tag: 'svg',
                            reference: 'svgElement',
                            namespace: "http://www.w3.org/2000/svg",
                            version: 1.1,
                            cls: 'x-surface'
                        }
                    ]
                }
            ]
        };
    },

    constructor: function (config) {
        var me = this;
        me.callSuper([config]);
        me.mainGroup = me.createSvgNode("g");
        me.defElement = me.createSvgNode("defs");
        // me.svgElement is assigned in element creation of Ext.Component.
        me.svgElement.appendChild(me.mainGroup);
        me.svgElement.appendChild(me.defElement);
        me.ctx = new Ext.draw.engine.SvgContext(me);
    },

    createSvgNode: function (type) {
        var node = document.createElementNS("http://www.w3.org/2000/svg", type);
        return Ext.get(node);
    },

    /**
     * @private
     * @param group
     * @param tag
     * @param position
     * @return {Ext.dom.Element}
     */
    getSvgElement: function (group, tag, position) {
        var element;
        if (group.dom.childNodes.length > position) {
            element = group.dom.childNodes[position];
            if (element.tagName === tag) {
                return Ext.get(element);
            } else {
                Ext.destroy(element);
            }
        }

        element = Ext.get(this.createSvgNode(tag));
        if (position === 0) {
            group.insertFirst(element);
        } else {
            element.insertAfter(Ext.fly(group.dom.childNodes[position - 1]));
        }
        element.cache = {};
        return element;
    },

    /**
     * @private
     * @param element
     * @param attributes
     */
    setElementAttributes: function (element, attributes) {
        var dom = element.dom,
            cache = element.cache,
            name, value;
        for (name in attributes) {
            value = attributes[name];
            if (cache[name] !== value) {
                cache[name] = value;
                dom.setAttribute(name, value);
            }
        }
    },

    /**
     * @private
     * @param tagName
     * @return {Ext.dom.Element}
     */
    getNextDef: function (tagName) {
        return this.getSvgElement(this.defElement, tagName, this.defPosition++);
    },

    // Inherited
    clearTransform: function () {
        var me = this;
        me.mainGroup.set({transform: me.matrix.toSvg()});
    },

    // Inherited
    clear: function () {
        this.ctx.clear();
        this.defPosition = 0;
    },

    // Inherited
    renderSprite: function (sprite) {
        var me = this,
            region = me.getRegion(),
            ctx = me.ctx;
        if (sprite.attr.hidden || sprite.attr.opacity === 0) {
            ctx.save();
            ctx.restore();
            return;
        }
        ctx.save();
        sprite.preRender(this);
        sprite.applyTransformations();
        sprite.useAttributes(ctx);
        sprite.render(this, ctx, [0, 0, region[2], region[3]]);
        sprite.setDirty(false);
        ctx.restore();
    },

    /**
     * Destroys the Canvas element and prepares it for Garbage Collection.
     */
    destroy: function (path, matrix, band) {
        var me = this;
        me.ctx.destroy();
        me.mainGroup.destroy();
        delete me.mainGroup;
        delete me.ctx;
        me.callSuper(arguments);
    }
});
