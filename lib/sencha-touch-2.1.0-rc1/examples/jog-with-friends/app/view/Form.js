/**
 * The Form that is shows when a user wants to add a new Run to the database.
 */
Ext.define('JWF.view.Form', {
    extend: 'Ext.form.Panel',
    requires: [
        'Ext.form.FieldSet',
        'Ext.field.Spinner',
        'Ext.field.DatePicker'
    ],

    config: {

        padding: '15 15 15 15',
        scrollable: false,

        items: [
            {
                docked: 'top',
                xtype: 'toolbar',
                title: 'New Jog',
                items: [
                    {
                        xtype: 'button',
                        text: 'Back',
                        ui: 'back',
                        id: 'addRunBackBtn'
                    }
                ]
            },
            {
                xtype: 'fieldset',
                items: [
                    {
                        xtype: 'textfield',
                        id   : 'locationField',
                        placeHolder: 'Where?'
                    },
                    {
                        xtype: 'numberfield',
                        id   : 'distanceField',
                        placeHolder: 'How Many Miles?'
                    }
                ]
            },
            {
                xtype: 'button',
                text: 'Add Jog',
                ui: 'facebook',
                id: 'addRunButton'
            }
        ]
    }
});
