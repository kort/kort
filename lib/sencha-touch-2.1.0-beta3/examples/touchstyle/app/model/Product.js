Ext.define('TouchStyle.model.Product', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
            'id',
            'name',
            'currency',
            'price',
            'priceLabel',
            'inStock',
            'retailer',
            'reatilerUrl',
            'description',
            'brandName',
            'brandUrl',
            'url',
            'categories',
            'seeMoreLabel',
            'seeMoreUrl',

            {
                name: 'sizes',
                convert: function(value, record) {
                    var ln = value.length,
                        sizes = [];

                    for (i = 0; i < ln; i++) {
                        sizes.push(value[i].name);
                    }

                    return sizes;
                }
            },
            {
                name: 'colors',
                convert: function(value, record) {
                    var ln = value.length,
                        colors = [];

                    for (i = 0; i < ln; i++) {
                        colors.push(value[i].name);
                    }

                    return colors;
                }
            },
            {
                name: 'images',
                convert: function(value, record) {
                    var ln = value.length,
                        images = {};

                    for (i = 0; i < ln; i++) {
                        images[value[i].sizeName.toLowerCase()]  = value[i].url;
                    }

                    return images;
                }
            }
        ],

        proxy: {
            type: 'jsonp',
            url: 'http://api.shopstyle.com/action/apiSearch',
            limitParam: 'count',
            startParam: 'min',
            pageParam: false,
            extraParams: {
                pid: 'uid6241-1493671-53',
                format: 'jsonp'
            },
            reader: {
                type: 'json',
                rootProperty: 'products'
            }
        }
    },

    toUrl: function() {
        return this.parentNode.get('urlId') + '/'+ this.get('id');
    }
});
