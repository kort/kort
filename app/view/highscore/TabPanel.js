/**
 * Main tab panel for highscore view.
 */
Ext.define('Kort.view.highscore.TabPanel', {
	extend: 'Ext.tab.Panel',
	alias: 'widget.highscoretabpanel',
    requires: [
        'Kort.view.highscore.AbsoluteList',
        'Kort.view.highscore.RelativeList'
    ],
    
	config: {
        title: '',
        fullscreen: true,
        cls: 'highscoreTabPanel',
        tabBar: {
            minHeight: '1em'
        }
	},
    
    initialize: function () {
        var globalHighscoreList,
            localHighscoreList;

        this.callParent(arguments);

        globalHighscoreList = {
            xtype: 'highscoreabsolutelist'
        };
        localHighscoreList = {
            xtype: 'highscorerelativelist'
        };
        
        this.add([globalHighscoreList, localHighscoreList]);
    }
});