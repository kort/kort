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
    
    onValidationListItemTap: function(list, index, target, record, e) {
        var voteTabPanel = Ext.create('Kort.view.validation.vote.TabPanel', {
            record: record,
            title: record.get('title')
        });
        this.getValidationNavigationView().push(voteTabPanel);
    }
});