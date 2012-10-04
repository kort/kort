/**
 * Demonstrates a 'reveal' card transition, which shows a new item by rendering the new item behind the current
 * visible item, then sliding the old item away to reveal the new one, in this case starting from the left
 */
Ext.define('Kitchensink.view.RevealLeft', {
    extend: 'Ext.Panel',
    requires: ['Kitchensink.view.LoremIpsum'],
    config: {
        cls: 'card card1',
        scrollable: true,
        items: [{
            docked: 'top',
            html: 'Reveal Left Animation'
        }, {
            xtype: 'loremipsum'
        }]
    }
});