Ext.define('TouchStyle.profile.Tablet', {
    extend: 'Ext.app.Profile',

    config: {
        name: 'tablet',
        namespace: 'tablet',
        controllers: ['Category'],
        views: ['Main']
    },

    isActive: function() {
        return !Ext.os.is.Phone;
    },

    launch: function() {
        Ext.create('TouchStyle.view.tablet.Main');
    }
});
