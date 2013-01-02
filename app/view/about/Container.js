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
				title: Ext.i18n.Bundle.message('about.title') + ' ' + Kort.util.Config.getKortTitle() + ' <span class="version">(v' + Kort.util.Config.getVersion() + ')</span>'
			},
			{
                html:   '<div class="about-content">' +
                            '<div class="logo">' +
                                '<img src="./resources/images/kort-logo.png" />' +
                            '</div>' +
                            '<dl class="kort-definitionlist info">' +
                                '<dt>' + Ext.i18n.Bundle.message('about.version.title') + '</dt>' +
                                '<dd>' + Kort.util.Config.getVersion() + '</dd>' +
                                '<dt>' + Ext.i18n.Bundle.message('about.information.title') + '</dt>' +
                                '<dd>' + Ext.i18n.Bundle.message('about.information.homepage') + ' ' + Kort.util.Config.getAbout().information[0] + '</dd>' +
                                '<dd>' + Ext.i18n.Bundle.message('about.information.feedback') + ' ' + Kort.util.Config.getAbout().information[1] + '</dd>' +
                                '<dd>' + Ext.i18n.Bundle.message('about.information.bugs') + ' ' + Kort.util.Config.getAbout().information[2] + '</dd>' +
                                '<dt>' + Ext.i18n.Bundle.message('about.developers.title') + '</dt>' +
                                '<dd>' +  Kort.util.Config.getAbout().developers[0] + '</dd>' +
                                '<dd>' +  Kort.util.Config.getAbout().developers[1] + '</dd>' +
                                '<dt>' + Ext.i18n.Bundle.message('about.project.title') + '</dt>' +
                                '<dd>' + Kort.util.Config.getAbout().project.title + '</dd>' +
                                '<dd>' + Kort.util.Config.getAbout().project.school + '</dd>' +
                                '<dd>' + Ext.i18n.Bundle.message('about.project.advisor') + ' ' + Kort.util.Config.getAbout().project.advisor + '</dd>' +
                                '<dt>' + Ext.i18n.Bundle.message('about.credits.title') + '</dt>' +
                                '<dd>' + Ext.i18n.Bundle.message('about.credits.partner') + ' ' + Kort.util.Config.getAbout().credits.partner + '</dd>' +
                                '<dd>' + Ext.i18n.Bundle.message('about.credits.mapdata') + ' ' + Kort.util.Config.getAbout().credits.mapdata + '</dd>' +
                                '<dd>' + Ext.i18n.Bundle.message('about.credits.tiledata') + ' ' + Kort.util.Config.getAbout().credits.tiledata + '</dd>' +
                                '<dd>' + Ext.i18n.Bundle.message('about.credits.markers') + ' ' + Kort.util.Config.getAbout().credits.markers + '</dd>' +
                                '<dt>' + Ext.i18n.Bundle.message('about.legal.title') + '</dt>' +
                                '<dd>' + Ext.i18n.Bundle.message('about.legal.message') + '</dd>' +
                            '</dl>' +
                        '</div>'
			}
		]
	}
});