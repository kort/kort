/**
 * Demonstrates a 'cover' card transition, which shows a new item by sliding it over the top of the 
 * current item, in this case starting from the right
 */
Ext.define('Kitchensink.view.CoverRight', {
    extend: 'Ext.Panel',
    requires: ['Kitchensink.view.LoremIpsum'],
    config: {
        cls: 'card card2',
        scrollable: true,
        items: [{
            docked: 'top',
            html: 'Cover Right Animation'
        }, {
            xtype: 'loremipsum'
        }]
    }
});