Ext.define('Kort.view.validation.List', {
	extend: 'Ext.List',
	alias: 'widget.validationlist',
    
	config: {
		layout: 'fit',
		store: 'Validations',
        grouped: true,
        loadingText: Ext.i18n.Bundle.message('validation.loadmask.message'),
        emptyText: Ext.i18n.Bundle.message('validation.emptytext'),
        itemTpl: '<div>{title} / {formattedDistance}</div>'
	}
});