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
            userStore = Ext.getStore('User'),
            user = userStore.first(),
            usernameValue = this.getUsernameTextfield().getValue();
        
        if(usernameValue !== '') {
            userStore.on('write', me.storeWriteHandler, this, { single: true });
            user.set('username', usernameValue);
        } else {
            console.log('please fill in a username');
        }
    },
    
    storeWriteHandler: function(store, operation) {
        this.getFirststepsPanel().hide();
        // TODO destroy panel after hide event
        //this.getFirststepsPanel().destroy();
    }
});