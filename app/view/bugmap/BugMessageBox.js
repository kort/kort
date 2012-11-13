Ext.define('Kort.view.bugmap.BugMessageBox', {
	extend: 'Ext.MessageBox',
	alias: 'widget.bugmessagebox',
    
    config: {
        cls: 'bugMessageBox',
        zIndex: Kort.util.Config.getZIndex().overlayLeafletMap
    }
});