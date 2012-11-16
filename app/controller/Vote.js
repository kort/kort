Ext.define('Kort.controller.Vote', {
    extend: 'Kort.controller.OsmMap',

    config: {
        views: [
            'validation.vote.Container',
            'validation.vote.Map'
        ],
        refs: {
            detailTabPanel: '.votetabpanel',
            voteMap: '.votetabpanel .votemap'
        },
        control: {
            voteMap: {
                maprender: 'onMaprender'
            }
        }
    },
    
    voteSuccessfulSubmittedHandler: function() {
        this.showSubmittedPopupPanel();
        // remove detail panel
        this.getBugmapNavigationView().pop();
    },

    /**
	 * Displays the confirmation popup
	 * @private
	 */
	showSubmittedPopupPanel: function() {
        var popupPanel = Ext.create('Kort.view.SubmittedPopupPanel');
		Ext.Viewport.add(popupPanel);
		popupPanel.show();
	}
});