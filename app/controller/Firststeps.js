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
                tap: '_onFirststepsFormSubmitButtonTap'
            },
            usernameTextfield: {
                keyup: '_onUsernameTextfieldKeyUp'
            }
        }
    },

    /**
     *
     * @private
     * Called when submit button of firststeps form gets pressed
     */
    _onFirststepsFormSubmitButtonTap: function() {
        var me = this,
            usernameValue = me.getUsernameTextfield().getValue(),
            messageBox;

        if(usernameValue === '') {
            messageBox = Ext.create('Kort.view.NotificationMessageBox');
            messageBox.alert(Ext.i18n.Bundle.message('firststeps.alert.username.empty.title'), Ext.i18n.Bundle.message('firststeps.alert.username.empty.message'), Ext.emptyFn);
            return;
        }
        if(usernameValue.search(/^[a-zA-Z0-9]+$/) === -1) {
            messageBox = Ext.create('Kort.view.NotificationMessageBox');
            messageBox.alert(Ext.i18n.Bundle.message('firststeps.alert.username.specialchars.title'), Ext.i18n.Bundle.message('firststeps.alert.username.specialchars.message'), Ext.emptyFn);
            return;
        }
        
        // saving username
        me.getFirststepsFormSubmitButton().disable();
        Kort.user.set('username', usernameValue);
        Kort.user.save({
            success: function() {
                me._userSuccessfullSavedHandler();
            },
            failure: function() {
                me.getFirststepsFormSubmitButton().enable();
                messageBox = Ext.create('Kort.view.NotificationMessageBox');
                messageBox.alert(Ext.i18n.Bundle.message('firststeps.alert.submit.failure.title'), Ext.i18n.Bundle.message('firststeps.alert.submit.failure.message'), Ext.emptyFn);
            }
        }, me);
    },

    /**
     *
     * @private
     * Called when user was successfully saved
     */
    _userSuccessfullSavedHandler: function() {
        this.getApplication().fireEvent('userchange');
        this.getFirststepsPanel().hide();
    },

    /**
     *
     * @private
     * @param {Ext.field.Text} field
     * @param {Ext.event.Event} e
     */
    _onUsernameTextfieldKeyUp: function(field, e) {
        // submit form if return key was pressed
        if (e.event.keyCode === 13){
            this._onFirststepsFormSubmitButtonTap();
        }
    }
});