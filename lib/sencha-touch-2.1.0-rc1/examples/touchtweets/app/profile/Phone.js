Ext.define('Twitter.profile.Phone', {
    extend: 'Ext.app.Profile',
    
    config: {
        views: ['Main'],
        controllers: ['Search']
    },
    
    isActive: function() {
        return Ext.os.is.Phone;
    },
    
    launch: function() {
        Ext.create('Twitter.view.phone.Main');
    }
});