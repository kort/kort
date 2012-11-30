Ext.define('Kort.controller.Validation', {
    extend: 'Ext.app.Controller',
    
    config: {
        views: [
            'validation.NavigationView',
            'validation.List',
            'validation.vote.TabPanel'
        ],
        refs: {
            mainTabPanel: '#mainTabPanel',
            validationNavigationView: '#validationNavigationView',
            validationList: '.validationlist'
        },
        control: {
            validationList: {
                itemtap: 'onValidationListItemTap'
            }
        }
    },
    
    init: function() {
        var me = this;
        me.callParent(arguments);
        
        me.getApplication().on({
            votesend: { fn: me.refreshView, scope: me },
            fixsend: { fn: me.refreshView, scope: me }
        });
    },
    
    refreshView: function() {
        var me = this;
        
        if(me.getValidationList()) {
            Ext.getStore('Validations').load(function(records, operation, success) {
                me.getValidationList().refresh();
            });
        }
    },
    
    onValidationListItemTap: function(list, index, target, record, e) {
        var voteTabPanel = Ext.create('Kort.view.validation.vote.TabPanel', {
            record: record,
            title: record.get('title')
        });
        this.getValidationNavigationView().push(voteTabPanel);
    }
});