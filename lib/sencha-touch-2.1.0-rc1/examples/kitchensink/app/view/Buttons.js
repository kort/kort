/**
 * Demonstrates a range of Button options the framework offers out of the box
 */
Ext.define('Kitchensink.view.Buttons', {
    extend: 'Ext.Container',

    requires: 'Ext.layout.VBox',

    config: {
        layout: {
            type : 'vbox',
            pack : 'center',
            align: 'stretch'
        },
        cls   : 'card1',
        defaults: {
            xtype: 'container',
            flex : 1,
            layout: {
                type : 'hbox',
                align: 'middle'
            },
            defaults: {
                xtype : 'button',
                flex  : 1,
                margin: 10
            }
        },
        items: [
            {
                items: [
                    {text: 'Normal'},
                    {ui: 'round', text: 'Round'},
                    {ui: 'small', text: 'Small'}
                ]
            },
            {
                items: [
                    {ui: 'decline', text: 'Decline'},
                    {ui: 'decline-round', text: 'Round'},
                    {ui: 'decline-small', text: 'Small'}
                ]
            },
            {
                items: Ext.os.deviceType.toLowerCase() == "phone" ? [
                    {ui: 'confirm', text: 'Confirm'},
                    {ui: 'confirm-round', text: 'Round'},
                    {ui: 'confirm-small', text: 'Small'}
                ] : [
                    {ui: 'confirm', text: 'Confirm'},
                    {ui: 'confirm-round', text: 'Round'},
                    {ui: 'confirm-small', text: 'Small'},
                    {ui: 'back', text: 'Back'}
                ]
            }
        ]
    }
});
