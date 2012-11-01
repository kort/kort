Ext.define('Kort.view.bugmap.fix.TabPanel', {
	extend: 'Ext.tab.Panel',
	alias: 'widget.fixtabpanel',
    
	config: {
        title: '',
        fullscreen: true,
        bugdata: null,
        
        items: [
            {
                xtype: 'fixformcontainer'
            }
        ]
	}
});