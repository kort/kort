Ext.define('Kort.controller.Validation', {
    extend: 'Ext.app.Controller',
    
    config: {
        views: [
            'validation.NavigationView',
            'validation.List'
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
        },
        routes: {
            'validation': 'showValidation'
        }
    },
    
    onValidationListItemTap: function(list, index, target, record, e) {
        var validationDetail = Ext.create('Ext.Container', {
            fullscreen: true,
            html: 'asdfasdf'
        });
        this.getValidationNavigationView().push(validationDetail);
    },
    
    showValidation: function() {
        this.getMainTabPanel().setActiveItem(this.getValidationNavigationView());
    }
});