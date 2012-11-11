Ext.define('Kort.view.bugmap.fix.TabPanel', {
	extend: 'Ext.tab.Panel',
	alias: 'widget.fixtabpanel',
    
	config: {
        title: '',
        fullscreen: true,
        id: 'fixTabPanel',
        tabBar: {
            minHeight: '1em'
        }
	},
    
    initialize: function () {
        this.callParent(arguments);

        var fixForm = {
            xtype: 'fixform',
            record: this.getRecord()
        };
        var fixMap = {
            xtype: 'fixmap'
        };
        
        this.add([fixForm, fixMap]);
    }
});