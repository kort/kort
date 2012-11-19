Ext.define('Kort.view.validation.vote.TabPanel', {
	extend: 'Ext.tab.Panel',
	alias: 'widget.votetabpanel',
    requires: [
        'Kort.view.validation.vote.Container',
        'Kort.view.LeafletMap'
    ],
    
	config: {
        title: '',
        fullscreen: true,
        cls: 'voteTabPanel',
        tabBar: {
            minHeight: '1em'
        }
	},
    
    initialize: function () {
        var voteContainer,
            voteMap;

        this.callParent(arguments);

        voteContainer = {
            xtype: 'votecontainer',
            record: this.getRecord()
        };
        voteMap = {
            title: Ext.i18n.Bundle.message('vote.map.title'),
            xtype: 'kortleafletmap',
            cls: 'voteMap'
        };
        
        this.add([voteContainer, voteMap]);
    }
});