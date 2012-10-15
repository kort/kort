/**
 * Demonstrates the 'pop' card transition
 */

Ext.define('Kitchensink.view.Pop', {
    extend: 'Ext.Panel',
    requires: ['Kitchensink.view.LoremIpsum'],
    config: {
        cls: 'card card3',
        scrollable: true,
        items: [{
            docked: 'top',
            html: 'Pop Animation'
        }, {
            xtype: 'loremipsum'
        }]
    }
});
