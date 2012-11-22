Ext.define('Kort.controller.Fix', {
    extend: 'Kort.controller.OsmMap',

    config: {
        views: [
            'bugmap.NavigationView',
            'bugmap.fix.TabPanel',
            'bugmap.fix.Form',
            'LeafletMap',
            'RewardMessageBox'
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
        }
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
                    me.fixSuccessfulSubmittedHandler(operation.getResponse().responseText);
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

    fixSuccessfulSubmittedHandler: function(responseText) {
        var rewardConfig = JSON.parse(responseText),
            reward = Ext.create('Kort.model.Reward', rewardConfig);
        
        this.reloadStores();
        this.showRewardMessageBox(reward);
        // remove detail panel
        this.getBugmapNavigationView().pop();
    },
    
    reloadStores: function() {
        Ext.getStore('User').load();
    },
    
	showRewardMessageBox: function(reward) {
        var messageBox = Ext.create('Kort.view.RewardMessageBox', {
            record: reward
        });
        messageBox.alert(Ext.i18n.Bundle.message('reward.alert.title'), messageBox.getRewardTpl().apply(reward.data), Ext.emptyFn);
	}
});