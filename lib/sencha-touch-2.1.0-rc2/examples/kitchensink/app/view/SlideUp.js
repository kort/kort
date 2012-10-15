/**
 * Demonstrates a 'slide' card transition, which shows a new item by sliding the new item in and
 * the old item out simultaneously, in this case with the new item coming in from the bottom
 */
Ext.define('Kitchensink.view.SlideUp', {
    extend: 'Ext.Panel',
    requires: ['Kitchensink.view.LoremIpsum'],
    config: {
        cls: 'card card3',
        scrollable: true,
        items: [{
            docked: 'top',
            html: 'Slide Up Animation'
        }, {
            xtype: 'loremipsum'
        }]
    }
});
