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
            },
            usernameTextfield: {
                keyup: 'onUsernameTextfieldKeyUp'
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
            var messageBox = Ext.create('Kort.view.NotificationMessageBox');
            messageBox.alert(Ext.i18n.Bundle.message('firststeps.alert.username.empty.title'), Ext.i18n.Bundle.message('firststeps.alert.username.empty.message'), Ext.emptyFn);
        }
    },

    storeWriteHandler: function(store, operation) {
        this.getFirststepsPanel().hide();
        // TODO destroy panel after hide event
        //this.getFirststepsPanel().destroy();
    },

    onUsernameTextfieldKeyUp: function(field, e) {
        // submit form if return key was pressed
        if (e.event.keyCode === 13){
            this.onFirststepsFormSubmitButtonTap();
        }
    }
});