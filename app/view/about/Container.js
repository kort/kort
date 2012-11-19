Ext.define('Kort.view.about.Container', {
	extend: 'Ext.Container',
	alias: 'widget.aboutcontainer',
    requires: [
        'Ext.TitleBar'
    ],
	
	config: {
		title: Ext.i18n.Bundle.message('tab.about'),
		url: 'about',
		id: 'aboutContainer',
		iconCls: 'info',
		layout: 'fit',
        scrollable: true,
		items: [
			{
				xtype: 'titlebar',
				cls: 'titlebar',
				docked: 'top',
				title: Ext.i18n.Bundle.message('about.title')
			},
			{
                html:   '<div class="about-content">' +
                            '<div class="logo">' +
                                '<img src="./resources/images/kort-logo.png" />' +
                            '</div>' +
                            '<dl>' +
                                '<dt>' + Ext.i18n.Bundle.message('about.version.title') + '</dt>' +
                                '<dd>' + Kort.util.Config.getVersion() + '</dd>' +
                            '</dl>' +
                        '</div>'
			}
		]
	}
});