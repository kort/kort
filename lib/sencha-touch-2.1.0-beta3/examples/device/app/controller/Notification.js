Ext.define('Device.controller.Notification', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            notificationView: 'notification'
        },

        control: {
            'button[action=simple]': {
                tap: 'onSimpleTap'
            },
            'button[action=multiple]': {
                tap: 'onMultipleTap'
            },
            'button[action=text]': {
                tap: 'onTextTap'
            },
            'button[action=login]': {
                tap: 'onLoginTap'
            },
            'button[action=vibrate]': {
                tap: 'onVibrateTap'
            }
        }
    },

    /**
     * Opens a simple notification with 1 button
     */
    onSimpleTap: function() {
        Ext.device.Notification.show({
            title: 'One Button',
            message: 'This is a simple notification with one button.',
            callback: function(button) {
                //When the user taps a button, show another notification
                Ext.device.Notification.show({
                    message: 'You pressed: "' + button + '"'
                });
            }
        });
    },

    /**
     * Opens a notification with multiple buttons
     */
    onMultipleTap: function() {
        Ext.device.Notification.show({
            title: 'Multiple Buttons',
            message: 'This is a notification with multiple buttons.',
            buttons: ["Cancel", "Login", "Another"],
            callback: function(button) {
                //When the user taps a button, show another notification
                Ext.device.Notification.show({
                    message: 'You pressed: "' + button + '"'
                });
            }
        });
    },

    /**
     * Shows a notification with a textfield
     */
    onTextTap: function() {
        Ext.device.Notification.show({
            title: 'My Title',
            message: 'A message',
            style: "text",
            buttons: ["Cancel", "Login"],
            callback: function(button, values, options) {
                //When the user taps a button, show another notification
                Ext.device.Notification.show({
                    message: 'You typed: "' + values + '"'
                });
            }
        });
    },

    /**
     * Shows a notification witha  textfield and password field
     */
    onLoginTap: function() {
        Ext.device.Notification.show({
            title: 'My Title',
            message: 'A message',
            style: "login",
            buttons: ["Cancel", "Login"],
            callback: function(button, values, options) {
                //When the user taps a button, show another notification
                Ext.device.Notification.show({
                    message: 'You typed: "' + values + '"'
                });
            }
        });
    },

    /**
     * Vibrates the device
     */
    onVibrateTap: function() {
        Ext.device.Notification.vibrate();
    }
});
