/**
 * Demonstrates a 'slide' card transition, which shows a new item by sliding the new item in and
 * the old item out simultaneously, in this case with the new item coming in from the left
 */
Ext.define('Kitchensink.view.SlideRight', {
    extend: 'Ext.Panel',
    requires: ['Kitchensink.view.LoremIpsum2'],
    config: {
        cls: 'card card2',
        scrollable: true,
        items: [{
            docked: 'top',
            html: 'Slide Right Animation'
        }, {
            xtype: 'loremipsum2'
        }]
    }
});
