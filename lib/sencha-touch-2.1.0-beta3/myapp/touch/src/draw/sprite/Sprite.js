/**
 * A Sprite is an object rendered in a Drawing surface. There are different options and types of sprites.
 * The configuration of a Sprite is an object with the following properties:
 *
 * - `type`: {@link String} - The type of the sprite. Possible options are 'circle', 'path', 'rect', 'text', 'square', 'image'.
 * - `group`: {@link String}/{@link Array} - The group that this sprite belongs to, or an array of groups. Only relevant when added to a {@link Ext.draw.Surface}.
 * - `width`: {@link Number} - Used in rectangle sprites, the width of the rectangle.
 * - `height`: {@link Number} - Used in rectangle sprites, the height of the rectangle.
 * - `size`: {@link Number} - Used in square sprites, the dimension of the square.
 * - `radius`: {@link Number} - Used in circle sprites, the radius of the circle.
 * - `x`: {@link Number} - The position along the x-axis.
 * - `y`: {@link Number} - The position along the y-axis.
 * - `path`: {@link Array} - Used in path sprites, the path of the sprite written in SVG-like path syntax.
 * - `opacity`: {@link Number} - The opacity of the sprite.
 * - `fill`: {@link String} - The fill color.
 * - `stroke`: {@link String} - The stroke color.
 * - `stroke-width`: {@link Number} - The width of the stroke.
 * - `font`: {@link String} - Used with text type sprites. The full font description. Uses the same syntax as the CSS `font` parameter.
 * - `text`: {@link String} - Used with text type sprites. The text itself.
 *
 * Additionally there are three transform objects that can be set with `setAttributes` which are `translate`, `rotate` and
 * `scale`.
 *
 * For translate, the configuration object contains `x` and `y` attributes that indicate where to
 * translate the object. For example:
 *
 *     sprite.setAttributes({
 *       translate: {
 *        x: 10,
 *        y: 10
 *       }
 *     }, true);
 *
 * For rotation, the configuration object contains `x` and `y` attributes for the center of the rotation (which are optional),
 * and a `degrees` attribute that specifies the rotation in degrees. For example:
 *
 *     sprite.setAttributes({
 *       rotate: {
 *        degrees: 90
 *       }
 *     }, true);
 *
 * For scaling, the configuration object contains `x` and `y` attributes for the x-axis and y-axis scaling. For example:
 *
 *     sprite.setAttributes({
 *       scale: {
 *        x: 10,
 *        y: 3
 *       }
 *     }, true);
 *
 * Sprites can be created with a reference to a {@link Ext.draw.Surface}
 *
 *      var drawComponent = Ext.create('Ext.draw.Component', {
 *          // ...
 *      });
 *
 *      var sprite = Ext.create('Ext.draw.sprite.Sprite', {
 *          type: 'circle',
 *          fill: '#ff0',
 *          surface: drawComponent.surface,
 *          radius: 5
 *      });
 *
 * Sprites can also be added to the surface as a configuration object:
 *
 *      var sprite = drawComponent.surface.add({
 *          type: 'circle',
 *          fill: '#ff0',
 *          radius: 5
 *      });
 *
 * In order to properly apply properties and render the sprite we have to
 * `show` the sprite setting the option `redraw` to `true`:
 *
 *      sprite.show(true);
 *
 * The constructor configuration object of the Sprite can also be used and passed into the {@link Ext.draw.Surface}
 * `add` method to append a new sprite to the canvas. For example:
 *
 *     drawComponent.surface.add({
 *         type: 'circle',
 *         fill: '#ffc',
 *         radius: 100,
 *         x: 100,
 *         y: 100
 *     });
 */
Ext.define('Ext.draw.sprite.Sprite', {

    mixins: {
        observable: 'Ext.mixin.Observable'
    },

    requires: [
        'Ext.draw.Draw',
        'Ext.draw.gradient.Gradient',
        'Ext.draw.sprite.AttributeDefinition',
        'Ext.draw.sprite.AttributeParser',
        'Ext.draw.modifier.Target',
        'Ext.draw.modifier.Animation'
    ],

    isSprite: true,

    inheritableStatics: {
        def: {
            processors: {
                strokeStyle: "color",
                fillStyle: "color",
                strokeOpacity: "limited01",
                fillOpacity: "limited01",

                lineWidth: "number",
                lineCap: "enums(butt,round,square)",
                lineJoin: "enums(round,bevel,miter)",
                miterLimit: "number",

                shadowColor: "color",
                shadowOffsetX: "number",
                shadowOffsetY: "number",
                shadowBlur: "number",

                globalAlpha: "limited01",
                globalCompositeOperation: "enums(source-over,destination-over,source-in,destination-in,source-out,destination-out,source-atop,destination-atop,lighter,xor,copy)",
                hidden: "bool",
                transformFillStroke: "bool",
                zIndex: "number",

                translationX: "number",
                translationY: "number",
                rotationRads: "number",
                rotationCenterX: "number",
                rotationCenterY: "number",
                scalingX: "number",
                scalingY: "number",
                scalingCenterX: "number",
                scalingCenterY: "number"
            },

            aliases: {
                "stroke": "strokeStyle",
                "fill": "fillStyle",
                "color": "fillStyle",
                "stroke-width": "lineWidth",
                "stroke-linecap": "lineCap",
                "stroke-linejoin": "lineJoin",
                "stroke-miterlimit": "miterLimit",
                "text-anchor": "textAlign",
                "opacity": "globalAlpha",

                translateX: "translationX",
                translateY: "translationY",
                rotateRads: "rotationRads",
                rotateCenterX: "rotationCenterX",
                rotateCenterY: "rotationCenterY",
                scaleX: "scalingX",
                scaleY: "scalingY",
                scaleCenterX: "scalingCenterX",
                scaleCenterY: "scalingCenterY"
            },

            defaults: {
                hidden: false,
                zIndex: 0,

                globalAlpha: 1,
                strokeOpacity: 1,
                fillOpacity: 1,
                transformFillStroke: false,

                translationX: 0,
                translationY: 0,
                rotationRads: 0,
                rotationCenterX: null,
                rotationCenterY: null,
                scalingX: 1,
                scalingY: 1,
                scalingCenterX: null,
                scalingCenterY: null
            },

            dirtyTriggers: {
                hidden: "canvas",
                zIndex: "zIndex",

                globalAlpha: "canvas",
                globalCompositeOperation: "canvas",

                transformFillStroke: "canvas",
                strokeStyle: "canvas",
                fillStyle: "canvas",
                strokeOpacity: "canvas",
                fillOpacity: "canvas",

                lineWidth: "canvas",
                lineCap: "canvas",
                lineJoin: "canvas",
                miterLimit: "canvas",

                shadowColor: "canvas",
                shadowOffsetX: "canvas",
                shadowOffsetY: "canvas",
                shadowBlur: "canvas",

                translationX: "transform",
                translationY: "transform",
                rotationRads: "transform",
                rotationCenterX: "transform",
                rotationCenterY: "transform",
                scalingX: "transform",
                scalingY: "transform",
                scalingCenterX: "transform",
                scalingCenterY: "transform"
            },

            updaters: {
                "bbox": function (attrs) {
                    attrs.bbox.plain.dirty = true;
                    attrs.bbox.transform.dirty = true;
                    if (
                        attrs.rotationRads !== 0 && (attrs.rotationCenterX === null || attrs.rotationCenterY === null) ||
                            ((attrs.scalingX !== 1 || attrs.scalingY !== 1) &&
                                (attrs.scalingCenterX === null || attrs.scalingCenterY === null)
                                )
                        ) {
                        if (!attrs.dirtyFlags.transform) {
                            attrs.dirtyFlags.transform = [];
                        }
                    }
                },

                "zIndex": function (attrs) {
                    attrs.dirtyZIndex = true;
                },

                "transform": function (attrs) {
                    attrs.dirtyTransform = true;
                    attrs.bbox.transform.dirty = true;
                }
            }
        }
    },

    config: {
        parent: null,
        skipFx: false
    },

    /**
     * @cfg {String} type The type of the sprite. Possible options are 'circle', 'path', 'rect', 'text', 'square', 'image'
     */

    /**
     * @cfg {Number} width Used in rectangle sprites, the width of the rectangle
     */

    /**
     * @cfg {Number} height Used in rectangle sprites, the height of the rectangle
     */

    /**
     * @cfg {Number} size Used in square sprites, the dimension of the square
     */

    /**
     * @cfg {Number} radius Used in circle sprites, the radius of the circle
     */

    /**
     * @cfg {Number} x The position along the x-axis
     */

    /**
     * @cfg {Number} y The position along the y-axis
     */

    /**
     * @cfg {Array} path Used in path sprites, the path of the sprite written in SVG-like path syntax
     */

    /**
     * @cfg {Number} opacity The opacity of the sprite
     */

    /**
     * @cfg {String} fill The fill color
     */

    /**
     * @cfg {String} stroke The stroke color
     */

    /**
     * @cfg {Number} stroke-width The width of the stroke
     */

    /**
     * @cfg {String} font Used with text type sprites. The full font description. Uses the same syntax as the CSS font parameter
     */

    /**
     * @cfg {String} text Used with text type sprites. The text itself
     */

    /**
     * @cfg {String/Array} group The group that this sprite belongs to, or an array of groups. Only relevant when added to a
     * {@link Ext.draw.Surface}
     */

    /**
     * @event beforedestroy
     */
    /**
     * @event destroy
     */
    /**
     * @event render
     */
    /**
     * @event mousedown
     */
    /**
     * @event mouseup
     */
    /**
     * @event mouseover
     */
    /**
     * @event mouseout
     */
    /**
     * @event mousemove
     */
    /**
     * @event click
     */
    /**
     * @event rightclick
     */
    /**
     * @event mouseenter
     */
    /**
     * @event mouseleave
     */
    /**
     * @event touchstart
     */
    /**
     * @event touchmove
     */
    /**
     * @event touchend
     */

    onClassExtended: function (Class, member) {
        var initCfg = Class.superclass.self.def.initialConfig,
            cfg;

        if (member.inheritableStatics && member.inheritableStatics.def) {
            cfg = Ext.merge({}, initCfg, member.inheritableStatics.def);
            Class.def = Ext.create("Ext.draw.sprite.AttributeDefinition", cfg);
            delete member.inheritableStatics.def;
        } else {
            Class.def = Ext.create("Ext.draw.sprite.AttributeDefinition", initCfg);
        }
    },

    constructor: function (config) {
        if (this.$className === 'Ext.draw.sprite.Sprite') {
            throw 'Ext.draw.sprite.Sprite is an abstract class';
        }
        config = config || {};
        var me = this,
            groups = [].concat(config.group || []),
            i, ln;

        config = config || {};
        me.id = config.id || Ext.id(null, 'ext-sprite-');
        me.group = new Array(groups.length);

        for (i = 0, ln = groups.length; i < ln; i++) {
            me.group[i] = groups[i].id || groups[i].toString();
        }

        me.attr = {};
        me.initConfig(config);
        me.prepareModifiers();
        me.initializeAttributes();
        me.setAttributes(config);
    },

    getDirty: function () {
        return this.attr.dirty;
    },

    setDirty: function (dirty) {
        if ((this.attr.dirty = dirty)) {
            if (this._parent) {
                this._parent.setDirty(true);
            }
        }
    },

    prepareModifiers: function () {
        // Set defaults
        var me = this,
            skipFx = me.getSkipFx();

        me.topModifier = new Ext.draw.modifier.Target({sprite: me});
        me.preFxModifiers = [];
        if (!skipFx) {
            // Link modifiers
            me.fx = new Ext.draw.modifier.Animation({sprite: me});
            me.fx.setNext(me.topModifier);
        }
    },

    initializeAttributes: function () {
        var me = this;
        me.topModifier.prepareAttributes(me.attr);
        me.setAttributesCanonical(me.self.def.getDefaults());
    },

    pushPreFxModifier: function (modifier) {
        modifier.beforeAttach(this);
        this.preFxModifiers.push(modifier);
        modifier.setNext(this.fx);
    },

    updateDirtyFlags: function (attrs) {
        var me = this,
            dirtyFlags = attrs.dirtyFlags, flags,
            updaters = me.self.def._updaters,
            any = false,
            dirty = false,
            flag;

        do {
            any = false;
            for (flag in dirtyFlags) {
                me.updateDirtyFlags = Ext.emptyFn;
                flags = dirtyFlags[flag];
                delete dirtyFlags[flag];
                if (updaters[flag]) {
                    updaters[flag].call(me, attrs, flags);
                }
                any = true;
                delete me.updateDirtyFlags;
            }
            dirty = dirty || any;
        } while (any);

        if (dirty) {
            me.setDirty(true);
        }
    },

    setAttributes: function (changes) {
        var attributes = this.attr;
        this.topModifier.pushDown(attributes, this.self.def.normalize(changes));
    },

    /**
     * Set attributes of the sprite, assuming the names and values have already been
     * normalized.
     *
     * @param {Object} changes The content of the change.
     * @param {Boolean} [avoidCopy] `true` to avoid copying the `changes` object.
     * The content of object may be destroyed.
     */
    setAttributesCanonical: function (changes, avoidCopy) {
        var attributes = this.attr;
        // TODO: Try to find a way to avoid this copy.
        // `this.topModifier.pushDown` will change the object,
        // That's way we need this copy now.
        if (avoidCopy) {
            this.topModifier.pushDown(attributes, changes);
        } else {
            this.topModifier.pushDown(attributes, Ext.apply({}, changes));
        }
    },

    /**
     * Returns the bounding box for the given Sprite as calculated with the Canvas engine.
     *
     * @param {Boolean} [isWithoutTransform] Whether to calculate the bounding box with the current transforms or not.
     */
    getBBox: function (isWithoutTransform) {
        var me = this,
            attr = me.attr,
            bbox = attr.bbox,
            plain = bbox.plain,
            transform = bbox.transform;
        if (plain.dirty) {
            me.updatePlainBBox(plain);
            plain.dirty = false;
        }
        if (isWithoutTransform) {
            return plain;
        } else {
            me.applyTransformations();
            if (transform.dirty) {
                me.updateTransformedBBox(transform, plain);
                transform.dirty = false;
            }
            return transform;
        }
    },


    /**
     * @protected
     * @function
     * Subclass will fill the plain object with `x`, `y`, `width`, `height` information of the plain bounding box of
     * this sprite.
     *
     * @param {Object} plain Target object.
     */
    updatePlainBBox: Ext.emptyFn,

    /**
     * @protected
     * Subclass will fill the plain object with `x`, `y`, `width`, `height` information of the transformed
     * bounding box of this sprite.
     *
     * @param {Object} transform Target object.
     * @param {Object} plain Auxilary object providing information of plain object.
     */
    updateTransformedBBox: function (transform, plain) {
        this.attr.matrix.transformBBox(plain, 0, transform);
    },

    /**
     * Subclass can rewrite this function to gain better performance.
     * @param {Boolean} isWithoutTransform
     * @return {Array}
     */
    getBBoxCenter: function (isWithoutTransform) {
        var bbox = this.getBBox(isWithoutTransform);
        if (bbox) {
            return [
                bbox.x + bbox.width * 0.5,
                bbox.y + bbox.height * 0.5
            ];
        } else {
            return [0, 0];
        }
    },

    /**
     * Hide the sprite.
     * @return {Ext.draw.sprite.Sprite} this
     * @chainable
     */
    hide: function () {
        this.attr.hidden = true;
        this.setDirty(true);
        return this;
    },

    /**
     * Show the sprite.
     * @return {Ext.draw.sprite.Sprite} this
     * @chainable
     */
    show: function () {
        this.attr.hidden = false;
        this.setDirty(true);
        return this;
    },

    useAttributes: function (ctx) {
        this.applyTransformations();
        var attrs = this.attr,
            canvasAttributes = attrs.canvasAttributes,
            strokeStyle = canvasAttributes.strokeStyle,
            fillStyle = canvasAttributes.fillStyle,
            bbox, id;

        if (strokeStyle && strokeStyle.isGradient) {
            bbox = this.getBBox(attrs.transformFillStroke);
            ctx.strokeStyle = 'white';
            if (bbox) {
                canvasAttributes.strokeStyle = strokeStyle.getGradient(ctx, bbox);
            }
        }

        if (fillStyle && fillStyle.isGradient) {
            bbox = bbox || this.getBBox(attrs.transformFillStroke);
            // Android browser forgot to reset the opacity of the fill if
            // fillStyle is assigned by a gradient.
            ctx.fillStyle = 'white';
            if (bbox) {
                canvasAttributes.fillStyle = fillStyle.getGradient(ctx, bbox);
            }
        }

        for (id in canvasAttributes) {
            if (canvasAttributes[id] !== undefined) {
                ctx[id] = canvasAttributes[id];
            }
        }
        canvasAttributes.strokeStyle = strokeStyle;
        canvasAttributes.fillStyle = fillStyle;
    },

    // @private
    applyTransformations: function (force) {
        if (!force && !this.attr.dirtyTransform) {
            return;
        }
        var me = this,
            attr = me.attr,
            center = me.getBBoxCenter(true),
            centerX = center[0],
            centerY = center[1],

            x = attr.translationX,
            y = attr.translationY,

            sx = attr.scalingX,
            sy = attr.scalingY === null ? attr.scalingX : attr.scalingY,
            scx = attr.scalingCenterX === null ? centerX : attr.scalingCenterX,
            scy = attr.scalingCenterY === null ? centerY : attr.scalingCenterY,

            rad = attr.rotationRads,
            rcx = attr.rotationCenterX === null ? centerX : attr.rotationCenterX,
            rcy = attr.rotationCenterY === null ? centerY : attr.rotationCenterY,

            cos = Math.cos(rad),
            sin = Math.sin(rad);

        if (sx === 1 && sy === 1) {
            scx = 0;
            scy = 0;
        }

        if (rad === 0) {
            rcx = 0;
            rcy = 0;
        }

        attr.matrix.elements = [
            cos * sx, sin * sy,
            -sin * sx, cos * sy,
            scx + (rcx - cos * rcx - scx + rcy * sin) * sx + x,
            scy + (rcy - cos * rcy - scy + rcx * -sin) * sy + y
        ];
        attr.matrix.inverse(attr.inverseMatrix);
        attr.dirtyTransform = false;
        attr.bbox.transform.dirty = true;
    },

    /**
     * Called before rendering.
     */
    preRender: Ext.emptyFn,

    /**
     * Render method.
     * @param {Ext.draw.Surface} surface The surface.
     * @param {Object} ctx A context object compatible with CanvasRenderingContext2D.
     * @param {Array} region The clip region (or called dirty rect) of the current rendering. Not be confused
     * with `surface.getRegion()`.
     */
    render: Ext.emptyFn,

    /**
     * Removes the sprite and clears all listeners.
     */
    destroy: function () {
        var me = this, modifier = me.topModifier, curr;
        while (modifier) {
            curr = modifier;
            modifier = modifier.getPrevious();
            curr.destroy();
        }

        me.destroy = Ext.emptyFn;
        if (me.fireEvent('beforedestroy', me) !== false) {
            me.fireEvent('destroy', me);
        }
        this.callSuper();
    }
}, function () {
    this.def = Ext.create("Ext.draw.sprite.AttributeDefinition", this.def);
});

