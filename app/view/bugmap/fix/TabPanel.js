/**
 * Main tab panel for fix view
 */
Ext.define('Kort.view.bugmap.fix.TabPanel', {
	extend: 'Ext.tab.Panel',
	alias: 'widget.fixtabpanel',
    requires: [
        'Kort.view.bugmap.fix.Form',
        'Kort.view.LeafletMap'
    ],
    
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
            title: Ext.i18n.Bundle.message('fix.map.title'),
            xtype: 'kortleafletmap',
            initialCenter: false,
            cls: 'fixMap'
        };
        
        this.add([fixForm, fixMap]);
    }
});