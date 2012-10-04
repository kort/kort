/**
 * Demonstrates a 'slide' card transition, which shows a new item by sliding the new item in and
 * the old item out simultaneously, in this case with the new item coming in from the right
 */
Ext.define('Kitchensink.view.SlideLeft', {
    extend: 'Ext.Panel',
    requires: ['Kitchensink.view.LoremIpsum'],
    config: {
        cls: 'card card1',
        scrollable: true,
        items: [{
            docked: 'top',
            html: 'Slide Left Animation'
        }, {
            xtype: 'loremipsum'
        }]
    }
});
