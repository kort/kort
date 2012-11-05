Ext.define('Kort.controller.Firststeps', {
    extend: 'Ext.app.Controller',

    config: {
        views: [
            'overlay.firststeps.Panel'
        ],
        refs: {
            firststepsPanel: '#firststepsPanel',
            usernameTextfield: '#firststepsPanel .textfield[name=username]',
            firststepsFormSubmitButton: '#firststepsFormSubmitButton'
        },
        control: {
            firststepsFormSubmitButton: {
                tap: 'onFirststepsFormSubmitButtonTap'
            }
        }
    },
    
    onFirststepsFormSubmitButtonTap: function() {
        var me = this,
            user = Ext.getStore('User').first(),
            usernameValue = this.getUsernameTextfield().getValue();
        
        if(usernameValue !== '') {
            user.set('username', usernameValue);
            user.save({
                success: function() {
                    me.usernameSuccessfulSubmittedHandler();
                },
                failure: function() {
                    console.log('failure');
                }
            });
        } else {
            console.log('please fill in a username');
        }
    },
    
    usernameSuccessfulSubmittedHandler: function() {
        this.getFirststepsPanel().hide();
        this.getFirststepsPanel().destroy();
    }
});