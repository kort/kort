Ext.define('Kort.view.task.TabPanel', {
	extend: 'Ext.tab.Panel',
	alias: 'widget.tasktabpanel',
    
	config: {
        title: '',
        fullscreen: true,
        ui: 'light',
        bugdata: null,
        
        items: [
            {
                xtype: 'taskformcontainer'
            }
        ]
	}
});