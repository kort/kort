Ext.define('Kort.controller.Fix', {
    extend: 'Kort.controller.OsmMap',

    config: {
        views: [
            'bugmap.fix.TabPanel',
            'bugmap.fix.Map',
            'bugmap.fix.Form',
			'SubmittedPopupPanel'
        ],
        refs: {
            bugmapNavigationView: '#bugmapNavigationView',
            detailTabPanel: '.fixtabpanel',
            fixFormSubmitButton: '.fixtabpanel .formpanel .button',
            fixField: '.fixtabpanel .formpanel .field',
            fixmap: '.fixtabpanel .fixmap'
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
            /*Ext.Ajax.request({
                url: './server/webservices/bug/fixes',
                callback: function(options, success, response) {
                    alert('form submitted successfully!');
                },
                scope: me,
                form: 'fixform',
                isUpload: true
            });*/

            fix = Ext.create('Kort.model.Fix', { error_id: detailTabPanel.getRecord().get('id'), message: fixFieldValue });
            fix.save({
                success: function() {
                    me.fixSuccessfulSubmittedHandler();
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

    fixSuccessfulSubmittedHandler: function() {
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