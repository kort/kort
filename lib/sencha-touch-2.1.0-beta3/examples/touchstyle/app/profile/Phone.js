Ext.define('TouchStyle.profile.Phone', {
    extend: 'Ext.app.Profile',

    config: {
        name: 'phone',
        namespace: 'phone',
        controllers: ['Category'],
        views: ['Main']
    },

    isActive: function() {
        return Ext.os.is.Phone;
    },

    launch: function() {
        Ext.create('TouchStyle.view.phone.Main');
    }
});
