Ext.define('TouchStyle.model.Category', {
    extend: 'Ext.data.Model',
    requires: ['TouchStyle.model.Product'],

    config: {
        fields: [
            'urlId',
            'label'
        ],

        proxy: {
            type: 'ajax',
            url: 'categories.json'
        },

        associations: [
            {
                type: 'hasMany',
                model: 'TouchStyle.model.Product',
                name: 'products',
                store: {
                    pageSize: 100,
                    clearOnPageLoad: false
                }
            }
        ]
    },


    toUrl: function() {
        return this.get('urlId');
    }
});


// Ext.define('TouchStyle.model.Category', {
//     extend: 'Ext.data.Model',
//     requires: ['TouchStyle.model.Product', 'TouchStyle.proxy.ShopSense'],

//     config: {
//         fields: [
//             'id',
//             'name',
//             'parentId'
//         ],

//         proxy: {
//             type: 'shopsense'
//         },

//         associations: [
//             {
//                 type: 'hasMany',
//                 model: 'TouchStyle.model.Category',
//                 name: 'categories',
//                 foreignKey: 'parentId',
//                 autoLoad: true
//             },
//             {
//                 type: 'hasMany',
//                 model: 'TouchStyle.model.Product',
//                 name: 'products',
//                 store: {
//                     pageSize: 100,
//                     clearOnPageLoad: false
//                 }
//             },
//             {
//                 type: 'belongsTo',
//                 model: 'TouchStyle.model.Category',
//                 name: 'category',
//                 foreignKey: 'parentId'
//             }
//         ]
//     },

//     toUrl: function() {
//         var parent = this,
//             url = parent.get('id'),
//             id;

//         console.log(parent.get('id'), parent.getCategory(), parent.getCategory().getCategory());

//         while ((parent = parent.getCategory())) {
//             id = parent.get('id');
//             if (id !== "clothes-shoes-and-jewelry") {
//                 url = parent.get('id') + '/' + url;
//             }
//         }

//         return url;
//     }
// });
