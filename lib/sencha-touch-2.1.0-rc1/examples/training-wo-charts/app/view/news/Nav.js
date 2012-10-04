Ext.define("CrimeFinder.view.news.Nav", {
  extend: 'Ext.dataview.List',
  xtype: 'newsnav',
  config: {
  	itemTpl: '{label}',
  	store: 'NewsMenuItems',
    onItemDisclosure: function() {},
    indexBar: false
  }
})