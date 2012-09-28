Ext.define('TouchStyle.view.tablet.Product', {
    extend: 'Ext.Sheet',
    xtype: 'product',

    requires: ['Ext.Img'],

    config: {
        baseCls: 'product-view',
        centered: true,
        width: 750,
        height: 450,
        modal: true,
        hideOnMaskTap: true,

        layout: {
            type: 'hbox'
        },

        items: [
            {
                xtype: 'image',
                flex: 1
            },
            {
                flex: 2,
                id: 'description',
                cls: 'description',
                scrollable: true,
                tpl: new Ext.XTemplate(
                    '<div class="name">{name}</div>',
                    '<div class="text">{description}</div>',
                    '<a href="{url}" target="_block">Buy Now</a>'
                )
            }
        ],

        showAnimation: {
            type: 'fadeIn',
            duration: 250,
            easing: 'ease-out'
        },

        hideAnimation: {
            type: 'fadeOut',
            duration: 250,
            easing: 'ease-in'
        }
    },

    initialize: function() {
        var image = this.down('image');

        image.on({
            scope: this,
            load: function() {
                image.element.dom.style.backgroundSize = "contain";
            }
        });
    },

    updateData: function(newData) {
        var image = this.down('image');

        image.element.dom.style.backgroundSize = "30%";
        image.element.dom.style.backgroundImage = 'url(resources/images/loading.gif)';
        image.setSrc('');
        image.setSrc(newData.images.best);
        Ext.getCmp('description').setData(newData);
    }
});
