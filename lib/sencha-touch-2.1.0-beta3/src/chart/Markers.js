/**
 *
 */
Ext.define("Ext.chart.Markers", {
    extend: 'Ext.draw.sprite.Instancing',
    revisions: 0,

    constructor: function () {
        this.callSuper(arguments);
        this.map = {};
        this.revisions = {};
    },

    clear: function (category) {
        category = category || 'default';
        if (!(category in this.revisions)) {
            this.revisions[category] = 1;
        } else {
            this.revisions[category]++;
        }
    },

    putMarkerFor: function (category, markerAttr, index) {
        category = category || 'default';

        var me = this,
            map = me.map[category] || (me.map[category] = {});
        if (index in map) {
            me.setAttributesFor(map[index], markerAttr);
        } else {
            map[index] = me.instances.length;
            me.createInstance(markerAttr);
        }
        me.instances[map[index]].category = category;
        me.instances[map[index]].revision = me.revisions[category] || (me.revisions[category] = 1);
    },

    /**
     *
     * @param {String} id
     * @param {Mixed} index
     * @param {Boolean} [isWithoutTransform]
     */
    getMarkerBBoxFor: function (category, index, isWithoutTransform) {
        if (category in this.map) {
            if (index in this.map[category]) {
                return this.getBBoxFor(this.map[category][index], isWithoutTransform);
            }
        }
    },

    getBBox: function () { return null; },

    render: function (surface, ctx, clipRegion) {
        var me = this,
            revisions = me.revisions,
            mat = me.attr.matrix,
            template = me.getTemplate(),
            originalAttr = template.attr,
            instances = me.instances,
            i, ln = me.instances.length;
        mat.toContext(ctx);
        template.preRender(surface, ctx, clipRegion);
        template.useAttributes(ctx);
        for (i = 0; i < ln; i++) {
            if (instances[i].revision !== revisions[instances[i].category]) {
                continue;
            }
            ctx.save();
            template.attr = instances[i];
            template.applyTransformations();
            template.useAttributes(ctx);
            template.render(surface, ctx, clipRegion);
            ctx.restore();
        }
        template.attr = originalAttr;
    }
});