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
            usernameValue = this.getUsernameTextfield().getValue(),
            messageBox;

        if(usernameValue !== '') {
            if(usernameValue.search(/^[a-zA-Z0-9]+$/) === -1) {
                messageBox = Ext.create('Kort.view.NotificationMessageBox');
                messageBox.alert(Ext.i18n.Bundle.message('firststeps.alert.username.specialchars.title'), Ext.i18n.Bundle.message('firststeps.alert.username.specialchars.message'), Ext.emptyFn);
            } else {
                Kort.user.set('username', usernameValue);
                Kort.user.save({
                    success: me.userSuccessfullSavedHandler
                }, me);
            }
        } else {
            messageBox = Ext.create('Kort.view.NotificationMessageBox');
            messageBox.alert(Ext.i18n.Bundle.message('firststeps.alert.username.empty.title'), Ext.i18n.Bundle.message('firststeps.alert.username.empty.message'), Ext.emptyFn);
        }
    },

    userSuccessfullSavedHandler: function(store, operation) {
        this.getApplication().fireEvent('usersave');
        this.getFirststepsPanel().hide();
    },

    onUsernameTextfieldKeyUp: function(field, e) {
        // submit form if return key was pressed
        if (e.event.keyCode === 13){
            this.onFirststepsFormSubmitButtonTap();
        }
    }
});