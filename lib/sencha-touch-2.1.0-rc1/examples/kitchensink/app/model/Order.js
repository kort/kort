Ext.require('Kitchensink.model.OrderItem', function() {
    Ext.define('Kitchensink.model.Order', {
        extend: 'Ext.data.Model',
        config: {
            fields: ['id', 'status'],
            hasMany: {
                model: 'Kitchensink.model.OrderItem',
                name: 'orderItems'
            }
        }
    });
});