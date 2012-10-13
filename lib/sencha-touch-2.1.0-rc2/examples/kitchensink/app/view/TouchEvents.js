/**
 * Presents a large touch zone and reports all of the touch events fired when the user interacts with it
 */
Ext.define('Kitchensink.view.TouchEvents', {
    extend: 'Ext.Container',
    xtype: 'touchevents',

    requires: [
        'Kitchensink.view.touchevent.Info',
        'Kitchensink.view.touchevent.Logger',
        'Kitchensink.view.touchevent.Pad'
    ],

    initialize: function() {
        this.callParent(arguments);

        var padElement = Ext.get('touchpad');

        padElement.on(['touchstart', 'touchend', 'touchmove',
                        'swipe', 'dragstart', 'drag', 'dragend',
                        'tap', 'doubletap', 'longpress', 'pinch', 'rotate'],
        'onTouchPadEvent', this);
    },

    onTouchPadEvent: function(e, target, options, eventController) {
        this.down('toucheventlogger').addLog(eventController.info.eventName);
    }
});
