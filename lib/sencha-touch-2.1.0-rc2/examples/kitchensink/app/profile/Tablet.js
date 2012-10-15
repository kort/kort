Ext.define('Kitchensink.profile.Tablet', {
    extend: 'Kitchensink.profile.Base',

    config: {
        controllers: ['Main'],
        views: ['Main', 'TouchEvents']
    },

    isActive: function() {
        return Ext.os.is.Tablet || Ext.os.is.Desktop;
    },

    launch: function() {
        Ext.create('Kitchensink.view.tablet.Main');

        this.callParent();
    }
});
