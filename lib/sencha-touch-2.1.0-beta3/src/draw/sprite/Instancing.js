/**
 *
 */
Ext.define("Ext.draw.sprite.Instancing", {
    extend: "Ext.draw.sprite.Sprite",
    alias: 'sprite.instancing',
    type: 'instancing',
    config: {
        template: null
    },
    instances: null,
    constructor: function (config) {
        this.instances = [];
        this.callSuper([config]);
        if (config && config.template) {
            this.setTemplate(config.template);
        }
    },

    applyTemplate: function (template) {
        if (!(template instanceof Ext.draw.sprite.Sprite)) {
            template = Ext.create(template.xclass || "sprite." + template.type, template);
        }
        template.setParent(this);
        template.attr.children = [];
        this.instances = [];
        this.position = 0;
        return template;
    },

    createInstance: function (config, data) {
        var template = this.getTemplate(),
            originalAttr = template.attr,
            attr = Ext.Object.chain(originalAttr);
        template.topModifier.prepareAttributes(attr);
        template.attr = attr;
        template.setAttributes(config);
        attr.data = data;
        this.instances.push(attr);
        template.attr = originalAttr;
        this.position++;
        originalAttr.children.push(attr);
        return attr;
    },

    getBBox: function () { return null; },

    getBBoxFor: function (index, isWithoutTransform) {
        var template = this.getTemplate(),
            originalAttr = template.attr,
            bbox;
        template.attr = this.instances[index];
        bbox = template.getBBox(isWithoutTransform);
        template.attr = originalAttr;
        return bbox;
    },

    render: function (surface, ctx, clipRegion) {
        var me = this,
            mat = me.attr.matrix,
            template = me.getTemplate(),
            originalAttr = template.attr,
            instances = me.instances,
            i, ln = me.position;

        mat.toContext(ctx);
        template.preRender(surface, ctx, clipRegion);
        template.useAttributes(ctx);
        for (i = 0; i < ln; i++) {
            ctx.save();
            template.attr = instances[i];
            template.applyTransformations();
            template.useAttributes(ctx);
            template.render(surface, ctx, clipRegion);
            ctx.restore();
        }
        template.attr = originalAttr;
    },

    setAttributesFor: function (index, changes) {
        var template = this.getTemplate(),
            originalAttr = template.attr,
            attr = this.instances[index];
        template.attr = attr;
        try {
            changes = template.self.def.normalize(changes);
            template.topModifier.pushDown(attr, changes);
        } finally {
            template.attr = originalAttr;
        }
    }
});