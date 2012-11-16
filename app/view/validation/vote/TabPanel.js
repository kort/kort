Ext.define('Kort.view.validation.vote.TabPanel', {
	extend: 'Ext.tab.Panel',
	alias: 'widget.votetabpanel',
    requires: [
        'Kort.view.validation.vote.Container',
        'Kort.view.validation.vote.Map'
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
            xtype: 'votemap'
        };
        
        this.add([voteContainer, voteMap]);
    }
});