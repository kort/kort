/**
 * Container for validation list and map
 */
Ext.define('Kort.view.validation.Container', {
	extend: 'Ext.Container',
	alias: 'widget.validationcontainer',
    requires: [
        'Kort.view.validation.List'
    ],

	config: {
        layout: 'card',
		items: [
			{
				xtype: 'validationlist'
			}
		]
	}
});