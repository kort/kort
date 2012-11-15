Ext.define('Kort.controller.Validation', {
    extend: 'Ext.app.Controller',
    
    config: {
        views: [
            'validation.Container',
            'validation.List'
        ],
        refs: {
            mainTabPanel: '#mainTabPanel',
            validationContainer: '#validationContainer'
        },
        routes: {
            'validation': 'showValidation'
        }
    },
    
    showValidation: function() {
        this.getMainTabPanel().setActiveItem(this.getValidationContainer());
    }
});