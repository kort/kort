/**
 * Validations list
 */
Ext.define('Kort.view.validation.List', {
	extend: 'Ext.List',
	alias: 'widget.validationlist',
    requires: [
        'Kort.view.validation.PullRefreshPlugin'
    ],
    
	config: {
		layout: 'fit',
		store: 'Validations',
        grouped: true,
        loadingText: false,
        emptyText: '<div class="emptytext">' + Ext.i18n.Bundle.message('validation.emptytext') + '</div>',
        disableSelection: true,
        scrollToTopOnRefresh: false,
        
        itemTpl:    '<div class="validation-item">' +
                        '<div class="image">' +
                            '<img class="bugtype-image" src="./resources/images/marker_icons/{type}.png" />' +
                        '</div>' +
                        '<div class="content">' +
                            '<div class="title">{title}</div>' +
                            '<div class="ratings">' +
                                '<span class="upratings">' +
                                    '<tpl if="upratings &gt; 0">+</tpl>' +
                                    '{upratings}' +
                                    '<img class="thumb" src="./resources/images/validation/thumbs-up.png" />' +
                                '</span>' +
                                '<span class="downratings">' +
                                    '<tpl if="downratings &gt; 0">-</tpl>' +
                                    '{downratings}' +
                                    '<img class="thumb" src="./resources/images/validation/thumbs-down.png" />' +
                                '</span>' +
                            '</div>' +
                        '</div>' +
                        '<tpl if="formatted_distance">' +
                            '<div class="distance">' +
                                '<div class="title">' + Ext.i18n.Bundle.message('validation.distance') + '</div> ' +
                                '<div class="value">{formatted_distance}</div>' +
                            '</div>' +
                        '</tpl>' +
                    '</div>',
        
        plugins: [
            {
                xclass: 'Kort.view.validation.PullRefreshPlugin'
            }
        ]
	}
});