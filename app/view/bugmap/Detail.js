Ext.define('Kort.view.bugmap.Detail', {
	extend: 'Ext.Container',
	alias: 'widget.bugdetail',
    
	config: {
		layout: 'card',
        title: 'Detail',
        bugdata: null,
        
        listeners: {
            initialize: 'onInitialize'
        }
	},
    
    onInitialize: function() {
        this.setTitle(this.getBugdata().get('title'));
        this.setHtml(this.getBugdata().get('description'));
    }
});