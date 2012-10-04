Ext.define('Particles.sprite.Emitter', {
    alias: 'sprite.emitter',
    extend: 'Ext.draw.sprite.Instancing',
    inheritableStatics: {
        def: {
            processors: {
                step: 'default',
                scope: function (n) {
                    if (!n) {
                        return this.holder;
                    }
                    return n;
                },
                corner: 'default'
            },
            defaults: {
                step: function () {
                    return false;
                },
                scope: null,
                corner: [0, 0, 1, 1]
            }
        }
    },

    constructor: function () {
        this.callParent(arguments);
        this.pool = [];
    },

    getBBox: function () {
        return {
            x: 0,
            y: 0,
            width: 1,
            height: 1
        };
    },

    updateTemplate: function () {
        this.pool.length = 0;
    },

    emit: function (data) {
        if (this.pool.length) {
            var instance = this.pool.pop();
            instance.data = [data, Ext.draw.Animator.animationTime()];
            this.instances.push(instance);
        } else {
            this.createInstance({}, [data, Ext.draw.Animator.animationTime()]);
        }
        this.animating = true;
        Ext.draw.Animator.add(this);
    },

    step: function (surface) {
        this.setDirty(true);
        var attr = this.attr,
            corner = attr.corner,
            template = this.getTemplate(),
            fn = attr.step,
            scope = attr.scope,
            now = Ext.draw.Animator.animationTime(),
            instances = this.instances;
        if (fn) {
            for (var i = 0, j = 0, ln = instances.length; i < ln; i++) {
                var data = instances[i].data,
                    tattr = fn.call(scope, data[0], now - data[1], corner);
                if (tattr) {
                    this.setAttributesFor(i, tattr);
                    instances[j++] = instances[i];
                } else {
                    this.pool.push(instances[i]);
                }
            }
            this.position = j;
            instances.length = j;
            if (j === 0) {
                this.animating = false;
            }
        }
    }
});