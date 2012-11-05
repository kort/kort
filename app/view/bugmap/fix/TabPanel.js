Ext.define('Kort.view.bugmap.fix.TabPanel', {
	extend: 'Ext.tab.Panel',
	alias: 'widget.fixtabpanel',
    
	config: {
        title: '',
        fullscreen: true,
        id: 'fixTabPanel',
        bugdata: null,
        
        items: [
            {
                xtype: 'fixform'
            },
            {
                xtype: 'fixmap'
            }
        ]
	}
});