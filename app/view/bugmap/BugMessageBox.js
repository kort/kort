/**
 * Message box which shows bug details
 */
Ext.define('Kort.view.bugmap.BugMessageBox', {
	extend: 'Ext.MessageBox',
	alias: 'widget.bugmessagebox',

    config: {
        cls: 'bugMessageBox',
        zIndex: Kort.util.Config.getZIndex().overlayLeafletMap
    },

    statics: {
        YESNO: [
            { text: Ext.i18n.Bundle.message('bugmap.messagebox.yes'), itemId: 'yes', ui: 'action'},
            { text: Ext.i18n.Bundle.message('bugmap.messagebox.no'), itemId: 'no'}
        ]
    },

    /**
     * @inheritdoc
	 * OVERRIDEN SENCHA TOUCH FUNCTION
	 * CHANGE: use own yes/no labels
	 */
    confirm: function(title, message, fn, scope) {

        return this.show({
            title       : title || null,
            message     : message || null,
            // use own yes/no labels
            buttons     : Kort.view.bugmap.BugMessageBox.YESNO,
            promptConfig: false,
            scope       : scope,
            fn: function() {
                if (fn) {
                    fn.apply(scope, arguments);
                }
            }
        });
    }
});