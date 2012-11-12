Ext.define('Kort.view.bugmap.fix.TabPanel', {
	extend: 'Ext.tab.Panel',
	alias: 'widget.fixtabpanel',
    
	config: {
        title: '',
        fullscreen: true,
        cls: 'fixTabPanel',
        tabBar: {
            minHeight: '1em'
        }
	},
    
    initialize: function () {
        var fixForm,
            fixMap;

        this.callParent(arguments);

        fixForm = {
            xtype: 'fixform',
            record: this.getRecord()
        };
        fixMap = {
            xtype: 'fixmap'
        };
        
        this.add([fixForm, fixMap]);
    }
});