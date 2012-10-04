Ext.define("CrimeFinder.view.MostWanteds", {
    extend: 'Ext.NestedList',
    xtype: 'mostwanteds',
  
    config: {
         iconCls: 'team',
         title: 'Top 10',
         store: 'MostWanteds',
       	 displayField: 'title',
		 detailCard: Ext.create("Ext.Container"),
         onItemDisclosure: function() {}
    },
    getItemTextTpl: function(rec) {  
      return '<tpl if="image != \'\'"><img src="{image}" align="center" hspace="2" /></tpl>{title}';
    }
});
