/**
 * Notification messagebox with overlays all panels.
 */
Ext.define('Kort.view.NotificationMessageBox', {
    extend: 'Ext.MessageBox',
    xtype: 'notificationmessagebox',

    config: {
        zIndex: Kort.util.Config.getZIndex().overlayOverlayPanel,
        hideOnMaskTap: true,
        cls: 'notificationMessageBox'
    }
});
