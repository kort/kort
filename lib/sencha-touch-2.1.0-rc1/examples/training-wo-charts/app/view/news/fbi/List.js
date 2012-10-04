Ext.define("CrimeFinder.view.news.fbi.List", {
    extend: 'Ext.dataview.List',
    xtype: 'fbipersons',
	
    config: { 
    	url: '',
    	title: '',
     	itemTpl: '<div class="contact"><img style="margin-right: 5px" align="center" src="{PHOTO}">{TITLE}</div>',
        grouped: true,
        indexBar: true,
        pinHeaders: true,
        onItemDisclosure: function() {},
        clearSelectionOnDeactivate: true
    }
});
