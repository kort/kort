/**
 * Demonstrates a 'flip' card transition
 */
Ext.define('Kitchensink.view.Flip', {
    extend: 'Ext.Panel',
    requires: ['Kitchensink.view.LoremIpsum2'],
    config: {
        cls: 'card card2',
        scrollable: true,
        items: [{
            docked: 'top',
            html: 'Flip Animation'
        }, {
            xtype: 'loremipsum2'
        }]
    }
});
