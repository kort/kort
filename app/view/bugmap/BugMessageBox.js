Ext.define('Kort.view.bugmap.BugMessageBox', {
	extend: 'Ext.MessageBox',
	alias: 'widget.bugmessagebox',
    
    config: {
        cls: 'bugMessageBox',
        zIndex: Kort.util.Config.getOverlayLeafletMapZIndex()
    },
    
    initialize: function () {
        this.callParent(arguments);

        var messageBoxContent = {
            xtype: 'component',
            cls: 'x-msgbox-text',
            record: this.getRecord(),
            tpl:    new Ext.Template(
                        '<div class="confirm-content">',
                            '<div class="description">',
                                '<div class="image">',
                                    //'<img class="bugtype-image" src="resources/images/bugtypes/{type}.png" />',
                                '</div>',
                                '<div class="content">',
                                    '<p>{description}</p>',
                                '</div>',
                            '</div>',
                        '</div>'
                    )
        };
        
        this.add([messageBoxContent]);
    }
});