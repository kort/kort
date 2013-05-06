Ext.define('Kort.controller.Notifications', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            tabPanel: 'main'
        }
    },

    init: function() {
        var me = this;
        this.getApplication().on({
            newsupdated: { fn: me.updateNewsBadgeText, scope: me },
            newsacceptedlanguagesupdated: { fn: me.updateNewsBadgeText, scope: me }
        });
    },

    updateNewsBadgeText: function() {
        this.getTabPanel().getTabBar().getComponent(3).setBadgeText(Ext.getStore('NewsLocal').getAmountOfUnreadNews());
    }
});
