Ext.define('Kort.controller.Fix', {
    extend: 'Kort.controller.OsmMap',

    config: {
        views: [
            'bugmap.NavigationView',
            'bugmap.fix.TabPanel',
            'bugmap.fix.Form',
			'SubmittedPopupPanel',
            'LeafletMap'
        ],
        refs: {
            bugmapNavigationView: '#bugmapNavigationView',
            detailTabPanel: '.fixtabpanel',
            fixFormSubmitButton: '.fixtabpanel .formpanel .button[cls=fixSubmitButton]',
            fixField: '.fixtabpanel .formpanel .field',
            fixmap: '.fixtabpanel .kortleafletmap[cls=fixMap]'
        },
        control: {
            fixFormSubmitButton: {
                tap: 'onFixFormSubmitButtonTap'
            },
            fixField: {
                keyup: 'onFixFieldKeyUp'
            },
            fixmap: {
                maprender: 'onMaprender'
            }
        },

        bugsStore: null
    },

    init: function() {
        this.setBugsStore(Ext.getStore('Bugs'));
    },

    onFixFormSubmitButtonTap: function() {
        var me = this,
            detailTabPanel = this.getDetailTabPanel(),
            fixFieldValue = this.getFixField().getValue(),
            fix,
            messageBox;

        if (fixFieldValue !== '') {
            fix = Ext.create('Kort.model.Fix', { error_id: detailTabPanel.getRecord().get('id'), message: fixFieldValue });
            fix.save({
                success: function(records, operation) {
                    var reward = Ext.create('Kort.model.Reward', operation.getResponse().responseText);
                    me.fixSuccessfulSubmittedHandler(reward);
                },
                failure: function() {
                    var messageBox = Ext.create('Kort.view.NotificationMessageBox');
                    messageBox.alert(Ext.i18n.Bundle.message('fix.alert.submit.failure.title'), Ext.i18n.Bundle.message('fix.alert.submit.failure.message'), Ext.emptyFn);
                }
            });
        } else {
            messageBox = Ext.create('Kort.view.NotificationMessageBox');
            messageBox.alert(Ext.i18n.Bundle.message('fix.alert.fixfield.empty.title'), Ext.i18n.Bundle.message('fix.alert.fixfield.empty.message'), Ext.emptyFn);
        }
    },

    onFixFieldKeyUp: function(field, e) {
        // submit form if return key was pressed
        if (e.event.keyCode === 13){
            this.onFixFormSubmitButtonTap();
        }
    },

    fixSuccessfulSubmittedHandler: function(reward) {
        this.showSubmittedPopupPanel(reward);
        // remove detail panel
        this.getBugmapNavigationView().pop();
    },

    /**
	 * Displays the confirmation popup
	 * @private
	 */
	showSubmittedPopupPanel: function(reward) {
        console.log(reward);
        reward.set('koins', 10);
        var badge = Ext.create('Kort.model.Badge', { name: 'bla', won: true });
        reward.set('koins', 10);
        reward.set('badges', badge);
        reward.commit();
        var messageBox = Ext.create('Kort.view.NotificationMessageBox');
        var tpl = new Ext.XTemplate(
            '<div class="messagebox-content">',
                '<div class="textpic">',
                    '<div class="image">',
                        '<img class="koin-image" src="./resources/images/koins/koin_no_value.png" />',
                    '</div>',
                    '<div class="content">',
                        '<p>' +
                            Ext.i18n.Bundle.message('fix.alert.reward.koins.1') +
                            ' <span class="important">{koins}</span> ' +
                            Ext.i18n.Bundle.message('fix.alert.reward.koins.2') +
                        '</p>',
                    '</div>',
                '</div>',
                '<div class="text">',
                    '<div class="content">',
                        '<h1> ' + Ext.i18n.Bundle.message('fix.alert.reward.badges.title') + ' </h1>',
                        '<div class="badges">',
                            '<tpl for="badges">',
                                '<div class="badge">',
                                    '<img src="./resources/images/badges/{name}-act.png" />',
                                    '<p class="badge-title">{name}</p>',
                                '</div>',
                            '</tpl>',
                        '</div>',
                        '</p>',
                    '</div>',
                '</div>',
            '</div>'
        );
        messageBox.alert(Ext.i18n.Bundle.message('fix.alert.reward.title'), tpl.apply(reward.data), Ext.emptyFn);
        //var notificationPanel = Ext.create('Kort.view.SubmittedPopupPanel');
		//Ext.Viewport.add(popupPanel);
		//popupPanel.show();
	}
});