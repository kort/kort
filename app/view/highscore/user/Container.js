/**
 * Main container for user view.
 */
Ext.define('Kort.view.highscore.user.Container', {
	extend: 'Ext.Container',
	alias: 'widget.usercontainer',
    requires: [
        'Ext.Button',
        'Kort.view.highscore.user.ContentComponent',
        'Kort.view.highscore.user.BadgesDataView'
    ],
	
	config: {
        cls: 'highscoreUserContainer',
        scrollable: true,
        layout: 'vbox'
	},

    /**
     * @private
     */
    initialize: function () {
        var highscoreUserContentComponent,
            highscoreUserBadgesDataView;

        this.callParent(arguments);

        highscoreUserContentComponent = {
            xtype: 'highscoreusercontentcomponent',
            record: this.getRecord()
        };
        
        highscoreUserBadgesDataView = {
            xtype: 'highscoreuserbadgesdataview'
        };
        
        this.add([highscoreUserContentComponent, highscoreUserBadgesDataView]);
    }
});