Ext.define('Kort.view.validation.List', {
	extend: 'Ext.List',
	alias: 'widget.validationlist',
    requires: [
        'Kort.plugin.PullRefresh'
    ],
    
	config: {
		layout: 'fit',
		store: 'Validations',
        grouped: true,
        loadingText: Ext.i18n.Bundle.message('validation.loadmask.message'),
        emptyText: Ext.i18n.Bundle.message('validation.emptytext'),
        disableSelection: true,
        
        itemTpl:    '<div class="validation-item">' +
                        '<div class="image">' +
                            '<img class="bugtype-image" src="./resources/images/marker_icons/{type}.png" />' +
                        '</div>' +
                        '<div class="content">' +
                            '<div class="title">{title}</div>' +
                            '<div class="ratings">' +
                                '<span class="upratings">' +
                                    '+{upratings}' +
                                    '<img class="thumb" src="./resources/images/validation/thumbs-up.png" />' +
                                '</span>' +
                                '<span class="downratings">' +
                                    '-{downratings}' +
                                    '<img class="thumb" src="./resources/images/validation/thumbs-down.png" />' +
                                '</span>' +
                            '</div>' +
                        '</div>' +
                        '<div class="distance">{formattedDistance}</div>' +
                    '</div>',
        
        plugins: [
            {
                xclass: 'Kort.plugin.PullRefresh'
            }
        ]
	}
});