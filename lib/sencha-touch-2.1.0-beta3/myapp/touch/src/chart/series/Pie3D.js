/**
 *
 */
Ext.define('Ext.chart.series.Pie3D', {
    requires: ['Ext.chart.series.sprite.Pie3DPart'],
    extend: 'Ext.chart.series.Series',
    type: 'pie3d',
    seriesType: 'pie3d',
    alias: 'series.pie3d',
    config: {
        region: [0, 0, 0, 0],
        thickness: 35,
        distortion: 0.5,

        /**
         * @cfg {String} angleField (required)
         * The store record field name to be used for the pie angles.
         * The values bound to this field name must be positive real numbers.
         */
        field: false,

        /**
         * @cfg {String} lengthField
         * The store record field name to be used for the pie slice lengths.
         * The values bound to this field name must be positive real numbers.
         */
        lengthField: false,

        /**
         * @cfg {Boolean/Number} donut
         * Whether to set the pie chart as donut chart.
         * Can be set to a particular percentage to set the radius
         * of the donut chart.
         */
        donut: false,

        rotation: 0
    },

    applyRotation: function (rotation) {
        var twoPie = Math.PI * 2;
        return (rotation % twoPie + twoPie) % twoPie;
    },

    updateRotation: function (rotation) {
        var sprites = this.getSprites(),
            i, ln;
        for (i = 0, ln = sprites.length; i < ln; i++) {
            sprites[i].setAttributes({
                baseRotation: rotation
            });
        }
    },

    updateColors: function (colorSet) {
        var subStyle = this.getSubStyle();
        if (!subStyle) {
            this.setSubStyle({});
            subStyle = this.getSubStyle();
        }
        subStyle.baseColor = colorSet;
    },

    updateRegion: function (region) {
        var me = this,
            zoom = 1,
            distortion = me.getDistortion(),
            thickness = me.getThickness(),
            height = thickness + region[2] * distortion + 100;
        if (height > region[3]) {
            zoom = region[3] / height;
        }
        me.radius = zoom * region[2] / 2;
        me.thickness = thickness * zoom;
        me.centerX = region[2] / 2;
        me.centerY = (-me.thickness + region[3]) / 2;
    },

    processData: function () {
        var me = this,
            chart = me.getChart(),
            animation = chart && chart.getAnimate(),
            store = me.getActualStore(),
            items = store.getData().items,
            length = items.length,
            field = me.getField(),
            value, sum = 0, ratio,
            summation = [],
            i,
            sprites = this.getSprites(),
            lastAngle;

        for (i = 0; i < length; i++) {
            value = items[i].get(field);
            sum += value;
            summation[i] = sum;
        }
        if (sum === 0) {
            return;
        }
        ratio = 2 * Math.PI / sum;
        for (i = 0; i < length; i++) {
            summation[i] *= ratio;
        }

        for (i = 0; i < sprites.length; i++) {
            sprites[i].fx.setConfig(animation);
        }

        for (i = 0, lastAngle = 0; i < length; i++) {
            var commonAttributes = {opacity: 1, startAngle: lastAngle, endAngle: summation[i]};
            sprites[i * 5].setAttributes(commonAttributes);
            sprites[i * 5 + 1].setAttributes(commonAttributes);
            sprites[i * 5 + 2].setAttributes(commonAttributes);
            sprites[i * 5 + 3].setAttributes(commonAttributes);
            sprites[i * 5 + 4].setAttributes(commonAttributes);
            lastAngle = summation[i];
        }
    },

    getSprites: function () {
        var me = this,
            chart = this.getChart(),
            surface = me.getSurface(),
            store = me.getActualStore();
        if (!store) {
            return [];
        }
        var items = store.getData().items,
            length = items.length,
            animation = chart && chart.getAnimate(),
            rotation = me.getRotation(),
            commonAttributes = {
                centerX: me.centerX,
                centerY: me.centerY,
                endRho: me.radius,
                startRho: me.radius * me.getDonut() / 100,
                thickness: me.thickness,
                distortion: me.getDistortion()
            }, sliceAttributes, twoPie = Math.PI * 2,
            topSprite, startSprite, endSprite, innerSideSprite, outerSideSprite,
            i;


        for (i = 0; i < length; i++) {
            sliceAttributes = Ext.apply({}, this.getStyleByIndex(i), commonAttributes);
            topSprite = me.sprites[i * 5];
            if (!topSprite) {
                topSprite = surface.add({
                    type: 'pie3dPart',
                    part: 'top',
                    startAngle: twoPie,
                    endAngle: twoPie
                });
                startSprite = surface.add({
                    type: 'pie3dPart',
                    part: 'start',
                    startAngle: twoPie,
                    endAngle: twoPie
                });
                endSprite = surface.add({
                    type: 'pie3dPart',
                    part: 'end',
                    startAngle: twoPie,
                    endAngle: twoPie
                });
                innerSideSprite = surface.add({
                    type: 'pie3dPart',
                    part: 'inner',
                    startAngle: twoPie,
                    endAngle: twoPie,
                    thickness: 0
                });
                outerSideSprite = surface.add({
                    type: 'pie3dPart',
                    part: 'outer',
                    startAngle: twoPie,
                    endAngle: twoPie,
                    thickness: 0
                });
                topSprite.fx.setDurationOn('baseRotation', 0);
                startSprite.fx.setDurationOn('baseRotation', 0);
                endSprite.fx.setDurationOn('baseRotation', 0);
                innerSideSprite.fx.setDurationOn('baseRotation', 0);
                outerSideSprite.fx.setDurationOn('baseRotation', 0);
                topSprite.setAttributes(sliceAttributes);
                startSprite.setAttributes(sliceAttributes);
                endSprite.setAttributes(sliceAttributes);
                innerSideSprite.setAttributes(sliceAttributes);
                outerSideSprite.setAttributes(sliceAttributes);
                me.sprites.push(topSprite, startSprite, endSprite, innerSideSprite, outerSideSprite);
            } else {
                startSprite = me.sprites[i * 5 + 1];
                endSprite = me.sprites[i * 5 + 2];
                innerSideSprite = me.sprites[i * 5 + 3];
                outerSideSprite = me.sprites[i * 5 + 4];
            }
            if (animation) {
                topSprite.fx.setConfig(animation);
                startSprite.fx.setConfig(animation);
                endSprite.fx.setConfig(animation);
                innerSideSprite.fx.setConfig(animation);
                outerSideSprite.fx.setConfig(animation);
            }
            topSprite.setAttributes(sliceAttributes);
            startSprite.setAttributes(sliceAttributes);
            endSprite.setAttributes(sliceAttributes);
            innerSideSprite.setAttributes(sliceAttributes);
            outerSideSprite.setAttributes(sliceAttributes);
        }

        for (i *= 5; i < me.sprites.length; i++) {
            me.sprites[i].fx.setConfig(animation);
            me.sprites[i].setAttributes({
                opacity: 0,
                startAngle: twoPie,
                endAngle: twoPie,
                baseRotation: rotation
            });
        }

        return me.sprites;
    }
});