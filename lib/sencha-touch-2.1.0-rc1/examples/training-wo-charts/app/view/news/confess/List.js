Ext.define("CrimeFinder.view.news.confess.List", {
    extend: 'Ext.dataview.List',
    xtype: 'confesslist',
	requires: [
	  'Ext.plugin.PullRefresh',
	  'Ext.plugin.ListPaging'
	],
    config: { 
     	itemTpl: '<div class="contact">{lname},{fname}</div>',
     	store: 'Confessions',
        onItemDisclosure: function() {},
        clearSelectionOnDeactivate: true,
        plugins: [
        {
            xclass: 'Ext.plugin.PullRefresh',
            pullRefreshText: 'Pull down to see recent confessions!'
        },
        {
            xclass: 'Ext.plugin.ListPaging',
            autoPaging: true
        }
    		]
    }
});
