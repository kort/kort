Ext.define('TouchStyle.view.phone.Products', {
    extend: 'Ext.Container',
    xtype: 'products',

    config: {
        baseCls: 'products',

        records: null,
        scrollable: {
            directionLock: true,
            direction: 'vertical'
        },

        tpl: new Ext.XTemplate(
            '<div class="row landscape">',
                '<tpl for="items">',
                    '{% if (xindex < 5) { %}',
                        '<div class="product" ref="{data.id}">',
                            '<div class="image" style="background-image:url({data.images.large});"></div>',
                            '<div class="name">{data.name}</div>',
                            '<div class="price">{data.priceLabel}<tpl if="data.brandName"> at {data.brandName}</tpl></div>',
                            '<a href="{data.url}" target="_block">Buy Now</a>',
                        '</div>',
                    '{% } %}',
                '</tpl>',
            '</div>'
        )
    },

    updateRecords: function(newRecords) {
        this.setData({
            items: newRecords.items,
            landscape: Ext.Viewport.getOrientation() == "landscape"
        });
    }
});
