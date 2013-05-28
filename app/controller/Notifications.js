/**
 * Handels badge texts of tab panel items.
 */
Ext.define('Kort.controller.Notifications', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            tabPanel: 'main'
        }
    },

    /**
     * @private
     */
    init: function() {
        var me = this;
        this.getApplication().on({
            newsupdated: { fn: me.updateNewsBadgeText, scope: me },
            newsacceptedlanguagesupdated: { fn: me.updateNewsBadgeText, scope: me }
        });
    },

    /**
     * Updates news badge text according to number of unread news items in NewsLocal store.
     */
    updateNewsBadgeText: function() {
        this.getTabPanel().getTabBar().getComponent(3).setBadgeText(Ext.getStore('NewsLocal').getAmountOfUnreadNews());
    }
});
