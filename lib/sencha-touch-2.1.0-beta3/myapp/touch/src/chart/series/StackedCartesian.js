/**
 * @extends Ext.chart.series.Cartesian
 */
Ext.define('Ext.chart.series.StackedCartesian', {

    extend: 'Ext.chart.series.Cartesian',

    config: {
        stacked: true
    },

    animatingSprites: 0,

    updateStacked: function () {
        this.processData();
    },

    coordinateY: function () {
        var me = this,
            store = me.getActualStore(),
            items = store.getData().items,
            axis = me.getYAxis(),
            range = {min: 0, max: 0},
            fieldCategories = me.fieldCategoryY || ['Y'],
            i, j, k, fields, field, data, dataStart = [], style = {},
            stacked = me.getStacked(),
            sprites = me.getSprites();

        if (sprites.length > 0) {
            for (i = 0; i < fieldCategories.length; i++) {
                fields = me.getFields([fieldCategories[i]]);
                for (j = 0; j < items.length; j++) {
                    dataStart[j] = 0;
                }
                for (j = 0; j < fields.length; j++) {
                    style = {};
                    field = fields[j];
                    data = me.coordinateData(items, field, axis);
                    if (stacked) {
                        style['dataStart' + fieldCategories[i]] = dataStart;
                        dataStart = dataStart.slice(0);
                        for (k = 0; k < items.length; k++) {
                            dataStart[k] += data[k];
                        }
                        style['data' + fieldCategories[i]] = dataStart;
                    } else {
                        style['dataStart' + fieldCategories[i]] = dataStart;
                        style['data' + fieldCategories[i]] = data;
                    }
                    sprites[j].setAttributes(style);
                    if (stacked) {
                        me.getRangeOfData(dataStart, range);
                    } else {
                        me.getRangeOfData(data, range);
                    }
                }
            }
            me.dataRange[1] = range.min;
            me.dataRange[3] = range.max;
            style = {};
            style.dataRange = me.dataRange;
            for (i = 0; i < sprites.length; i++) {
                sprites[i].setAttributes(style);
            }
        }
    },

    getFields: function (fieldCategory) {
        var me = this,
            fields = [], fieldsItem,
            i, ln;
        for (i = 0, ln = fieldCategory.length; i < ln; i++) {
            fieldsItem = me['get' + fieldCategory[i] + 'Field']();
            if (Ext.isArray(fieldsItem)) {
                fields.push.apply(fields, fieldsItem);
            } else {
                fields.push(fieldsItem);
            }
        }
        return fields;
    },

    getSprites: function () {
        var me = this,
            chart = this.getChart(),
            animation = chart && chart.getAnimate(),
            surface,
            fields = me.getFields(me.fieldCategoryY),
            sprites = me.sprites,
            i, length = fields.length,
            sprite;

        if (!chart) {
            return [];
        }

        surface = this.getSurface();

        for (i = 0; i < length; i++) {
            sprite = sprites[i];
            if (!sprite) {
                sprite = surface.add({type: me.seriesType});
                sprites.push(sprite);
                sprite.fx.on('animationstart', 'onSpriteAnimationStart', this);
                sprite.fx.on('animationend', 'onSpriteAnimationEnd', this);

                if (me.getLabel()) {
                    sprite.bindMarker('labels', me.getLabel());
                }
                if (me.getMarker()) {
                    sprite.bindMarker('items', me.getMarker());
                }
            }
            if (animation) {
                sprite.fx.setConfig(animation);
                me.getLabel().setAttributes({
                    labelOverflowPadding: this.getLabelOverflowPadding()
                });
                me.getLabel().getTemplate().fx.setSpecialDuration({'callout': 200});
            }
            sprite.setAttributes(me.getStyleByIndex(i));
        }
        return sprites;
    },

    onSpriteAnimationStart: function (sprite) {
        this.animatingSprites++;
        if (this.animatingSprites === 1) {
            this.fireEvent('animationstart');
        }
    },

    onSpriteAnimationEnd: function (sprite) {
        this.animatingSprites--;
        if (this.animatingSprites === 0) {
            this.fireEvent('animationend');
        }
    }
});
