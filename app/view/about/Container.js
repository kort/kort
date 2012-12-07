/**
 * Main container for about tab
 */
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
		layout: 'vbox',
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
                            '<dl class="kort-definitionlist info">' +
                                '<dt>' + Ext.i18n.Bundle.message('about.version.title') + '</dt>' +
                                '<dd>' + Kort.util.Config.getVersion() + '</dd>' +
                                '<dt>' + Ext.i18n.Bundle.message('about.authors.title') + '</dt>' +
                                '<dd>' +  Kort.util.Config.getAbout().authors[0] + '</dd>' +
                                '<dd>' +  Kort.util.Config.getAbout().authors[1] + '</dd>' +
                                '<dt>' + Ext.i18n.Bundle.message('about.project.title') + '</dt>' +
                                '<dd>' + Kort.util.Config.getAbout().project + '</dd>' +
                                '<dt>' + Ext.i18n.Bundle.message('about.partners.title') + '</dt>' +
                                '<dd>' + Kort.util.Config.getAbout().partners[0] + '</dd>' +
                                '<dt>' + Ext.i18n.Bundle.message('about.legal.title') + '</dt>' +
                                '<dd>' + Ext.i18n.Bundle.message('about.legal.message') + '</dd>' +
                            '</dl>' +
                        '</div>'
			}
		]
	}
});