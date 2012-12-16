/**
 * Controller for validation tab
 */
Ext.define('Kort.controller.Validation', {
    extend: 'Ext.app.Controller',
    
    config: {
        views: [
            'validation.NavigationView',
            'validation.List',
            'validation.vote.Container'
        ],
        refs: {
            mainTabPanel: '#mainTabPanel',
            validationNavigationView: '#validationNavigationView',
            validationList: '.validationlist',
            validationRefreshButton: '#validationNavigationView .button[cls=validationRefreshButton]'
        },
        control: {
            validationList: {
                itemtap: 'onValidationListItemTap'
            },
            validationRefreshButton: {
                tap: 'onValidationRefreshButtonTap'
            },
            validationNavigationView: {
                detailpush: 'onValidationNavigationViewDetailPush',
                detailpop: 'onValidationNavigationViewBack',
                back: 'onValidationNavigationViewBack'
            }
        },
        
        itemTapDisabled: false
    },
    
    // @private
    init: function() {
        var me = this;
        me.callParent(arguments);
        
        me.getApplication().on({
            votesend: { fn: me.refreshView, scope: me },
            fixsend: { fn: me.refreshView, scope: me }
        });
    },
    
    // @private
    onValidationRefreshButtonTap: function() {
        this.refreshView();
    },
    
    /**
     * @private
     * Refreshes validations view
     */
    refreshView: function() {
        var me = this,
            validationsStore = Ext.getStore('Validations');
        
        if(me.getValidationList()) {
            me.getValidationList().mask();
            validationsStore.load(function(records, operation, success) {
                validationsStore.updateDistances(Kort.geolocation);
                me.getValidationList().refresh();
                me.getValidationList().unmask();
            });
        }
    },
    
    /**
     * @private
     * Displays vote panel for given validation
     */
    onValidationListItemTap: function(list, index, target, record, e) {
        var me = this,
            validationNavigationView = me.getValidationNavigationView(),
            voteContainer;
        
        if(!me.getItemTapDisabled()) {
            // disable fast tapping
            me.setItemTapDisabled(true);
            Ext.defer(function() {
                me.setItemTapDisabled(false);
            }, 500);
            
            voteContainer = Ext.create('Kort.view.validation.vote.Container', {
                record: record,
                title: record.get('title')
            });
            validationNavigationView.push(voteContainer);
            validationNavigationView.fireEvent('detailpush', validationNavigationView);
        }
    },
    
    // @private
    onValidationNavigationViewDetailPush: function(cmp, view, opts) {
        this.getValidationRefreshButton().hide();
    },
    
    // @private
    onValidationNavigationViewBack: function(cmp, view, opts) {
        this.getValidationRefreshButton().show();
    }
});