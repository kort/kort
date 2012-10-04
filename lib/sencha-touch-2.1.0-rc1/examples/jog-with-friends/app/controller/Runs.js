/**
 * The class controls the adding of new Runs to the database.
 */
Ext.define('JWF.controller.Runs', {
    extend: 'Ext.app.Controller',

    config: {
        control: {
            '#addRunButton': {
                tap: 'addRun'
            },
            '#showFormButton': {
                tap: 'showForm'
            },
            '#addRunBackBtn': {
                tap: 'hideForm'
            }
        }
    },

    init: function() {
        this.callParent();

        Ext.getStore('Runs').on('load', this.onRunsLoad);
    },

    onRunsLoad: function(store) {

        var main = Ext.getCmp('main'),
            runList = Ext.getCmp('runList'),
            noFriends = Ext.getCmp('noFriends');

        if (store.getCount()) {
            if (!runList) {
                runList = Ext.create('JWF.view.run.List', {
                    id: 'runList'
                });
            }
            main.setActiveItem(runList);
        } else {
            if (!noFriends) {
                noFriends = Ext.create('JWF.view.NoFriends', {
                    id: 'noFriends',
                    data: JWF.userData
                });
            }
            main.setActiveItem(noFriends);
        }
    },

    showForm: function() {
        if (!this.addRunForm) {
            this.addRunForm = Ext.create('JWF.view.Form', {
                id: 'runForm'
            });
        }
        Ext.Viewport.setActiveItem(this.addRunForm);
    },

    hideForm: function() {
        Ext.Viewport.setActiveItem(Ext.getCmp('main'));
        Ext.getCmp('runForm').hide();
    },

    addRun: function() {

        var distance = Ext.getCmp('distanceField').getValue(),
            location = Ext.getCmp('locationField').getValue(),
            caption = JWF.userData.first_name + ' ran ' + distance + ' miles';

        if (location) {
            caption += ' in ' + location;
        }

        Ext.getCmp('runForm').setMasked({
            xtype: 'loadmask',
            message: 'Adding New Jog...'
        });

        Ext.Ajax.request({
            url: '/run',
            method: 'POST',
            params: {
                location: location,
                distance: distance
            },
            callback: this.onAddRun,
            scope: this
        });
    },

    onAddRun: function(options, success, response) {
        Ext.getCmp('runForm').setMasked(false);
        this.hideForm();
        Ext.getStore('Runs').load();
    }
});
