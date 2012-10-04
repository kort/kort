
Ext.define('CrimeFinder.view.phone.Main', {
    extend: 'Ext.navigation.View',
    requires: [
      'CrimeFinder.view.phone.MainMenu'
    ],
    config: {
      items: [
       {
      	title: 'CrimeFinder',
      	xtype: 'iconmenu'
       }
      ]
    }
});
