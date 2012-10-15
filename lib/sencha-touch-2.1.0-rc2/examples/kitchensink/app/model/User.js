Ext.require('Kitchensink.model.Order', function() {
    Ext.define('Kitchensink.model.User', {
        extend: 'Ext.data.Model',
        config: {
            fields: ['id', 'name'],
            hasMany: {
                model: 'Kitchensink.model.Order',
                name: 'orders'
            },
            proxy: {
                type: 'ajax',
                url : 'userData.json'
            }
        }
    });
});
