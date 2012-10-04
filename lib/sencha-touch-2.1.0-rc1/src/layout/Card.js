/**
 *
 */
Ext.define('Ext.layout.Card', {
    extend: 'Ext.layout.Default',

    alias: 'layout.card',

    isCard: true,

    layoutClass: 'x-layout-card',

    itemClass: 'x-layout-card-item',

    requires: [
        'Ext.fx.layout.Card'
    ],

    /**
     * @private
     */
    applyAnimation: function(animation) {
        return new Ext.fx.layout.Card(animation);
    },

    /**
     * @private
     */
    updateAnimation: function(animation, oldAnimation) {
        if (animation && animation.isAnimation) {
            animation.setLayout(this);
        }

        if (oldAnimation) {
            oldAnimation.destroy();
        }
    },

    setContainer: function(container) {
        this.callSuper(arguments);

        container.innerElement.addCls(this.layoutClass);
        container.onInitialized('onContainerInitialized', this);
    },

    onContainerInitialized: function() {
        var container = this.container,
            activeItem = container.getActiveItem();

        if (activeItem) {
            activeItem.show();
        }

        container.on('activeitemchange', 'onContainerActiveItemChange', this);
    },

    /**
     * @private
     */
    onContainerActiveItemChange: function(container) {
        this.relayEvent(arguments, 'doActiveItemChange');
    },

    onItemInnerStateChange: function(item, isInner, destroying) {
        this.callSuper(arguments);
        var container = this.container,
            activeItem = container.getActiveItem();

        item.toggleCls(this.itemClass, isInner);
        item.setLayoutSizeFlags(isInner ? container.LAYOUT_BOTH : 0);

        if (isInner) {
            if (activeItem !== container.innerIndexOf(item) && activeItem !== item && item !== container.pendingActiveItem) {
                item.hide();
            }
        }
        else {
            if (!destroying && !item.isDestroyed && item.isDestroying !== true) {
                item.show();
            }
        }
    },

    /**
     * @private
     */
    doActiveItemChange: function(me, newActiveItem, oldActiveItem) {
        if (oldActiveItem) {
            oldActiveItem.hide();
        }

        if (newActiveItem) {
            newActiveItem.show();
        }
    },

    destroy:  function () {
        this.callParent(arguments);
        Ext.destroy(this.getAnimation());
    }
});
