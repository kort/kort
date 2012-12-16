/**
 * Controller for firststeps overlay
 */
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

    /**
     * Called when submit button of firststeps form gets pressed
     */
    onFirststepsFormSubmitButtonTap: function() {
        var me = this,
            usernameValue = me.getUsernameTextfield().getValue(),
            messageBox;

        if(usernameValue !== '') {
            if(usernameValue.search(/^[a-zA-Z0-9]+$/) === -1) {
                messageBox = Ext.create('Kort.view.NotificationMessageBox');
                messageBox.alert(Ext.i18n.Bundle.message('firststeps.alert.username.specialchars.title'), Ext.i18n.Bundle.message('firststeps.alert.username.specialchars.message'), Ext.emptyFn);
            } else {
                me.getFirststepsFormSubmitButton().disable();
                Kort.user.set('username', usernameValue);
                Kort.user.save({
                    success: function() {
                        me.userSuccessfullSavedHandler();
                    },
                    failure: function() {
                        me.getFirststepsFormSubmitButton().enable();
                        messageBox = Ext.create('Kort.view.NotificationMessageBox');
                        messageBox.alert(Ext.i18n.Bundle.message('firststeps.alert.submit.failure.title'), Ext.i18n.Bundle.message('firststeps.alert.submit.failure.message'), Ext.emptyFn);
                    }
                }, me);
            }
        } else {
            messageBox = Ext.create('Kort.view.NotificationMessageBox');
            messageBox.alert(Ext.i18n.Bundle.message('firststeps.alert.username.empty.title'), Ext.i18n.Bundle.message('firststeps.alert.username.empty.message'), Ext.emptyFn);
        }
    },

    /**
     * Called when user was successfull saved
     */
    userSuccessfullSavedHandler: function(store, operation) {
        this.getApplication().fireEvent('userchange');
        this.getFirststepsPanel().hide();
    },

    // @private
    onUsernameTextfieldKeyUp: function(field, e) {
        // submit form if return key was pressed
        if (e.event.keyCode === 13){
            this.onFirststepsFormSubmitButtonTap();
        }
    }
});