Ext.define('Kort.controller.Verify', {
    extend: 'Ext.app.Controller',
    
    config: {
        views: [
            'verify.Container'
        ],
        refs: {
            mainTabPanel: '#mainTabPanel',
            verifyContainer: '#verifyContainer'
        },
        routes: {
            'verify': 'showVerify'
        }
    },
    
    showVerify: function() {
        this.getMainTabPanel().setActiveItem(this.getVerifyContainer());
    }
});