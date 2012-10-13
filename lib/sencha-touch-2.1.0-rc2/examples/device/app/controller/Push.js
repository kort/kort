Ext.define('Device.controller.Push', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            content: 'pushnotifications',
            logger: '#logger',
            newButton: 'button[action=new]',
            registerButton: 'button[action=register]',
            registerPanel: {
                xtype: 'registerpanel',
                selector: 'registerpanel',
                autoCreate: true
            }
        },

        control: {
            newButton: {
                tap: 'onNew'
            },
            registerButton: {
                tap: 'onRegister'
            }
        }
    },

    onNew: function() {
        this.getContent().push(this.getRegisterPanel());
        this.getNewButton().hide();
        this.getRegisterButton().show();
    },

    validate: function() {
        var form = this.getRegisterPanel(),
            values = form.getValues(),
            hasOne = false,
            total = 0,
            type, name;

        for (name in values) {
            if (values[name]) {
                hasOne = true;
                total += values[name];
            }
        }

        if (hasOne) {
            switch (total) {
                case 1:
                    type = Ext.device.Push.ALERT;
                break;
                case 2:
                    type = Ext.device.Push.BADGE;
                break;
                case 4:
                    type = Ext.device.Push.SOUND;
                break;

                case 3:
                    type = Ext.device.Push.ALERT|Ext.device.Push.BADGE;
                break;
                case 5:
                    type = Ext.device.Push.ALERT|Ext.device.Push.SOUND;
                break;

                case 6:
                    type = Ext.device.Push.BADGE|Ext.device.Push.SOUND;
                break;

                case 7:
                    type = Ext.device.Push.ALERT|Ext.device.Push.BADGE|Ext.device.Push.SOUND;
                break;

                default:
                    type = 0;
            }
        }

        return (hasOne) ? type : false;
    },

    onRegister: function() {
        var content = this.getContent(),
            type = this.validate();

        if (!type) {
            return;
        } else {
            content.pop();
            this.getNewButton().show();
            this.getRegisterButton().hide();
        }

        this.getLogger().insert(0, {
            html: 'register: '  + type
        });

        Ext.device.Push.register({
            scope: this,

            success: this.onSuccess,
            failure: this.onFailure,
            received: this.onReceived,

            type: type
        });
    },

    onSuccess: function(token) {
        this.getLogger().insert(0, {
            html: 'success: ' + token
        });
    },

    onFailure: function(error) {
        this.getLogger().insert(0, {
            html: 'failure: ' + error
        });
    },

    onReceived: function(notifications) {
        this.getLogger().insert(0, {
            html: 'received: ' + JSON.stringify(notifications)
        });
    }
});
