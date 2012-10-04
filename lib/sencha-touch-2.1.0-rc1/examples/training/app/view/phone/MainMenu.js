Ext.define("CrimeFinder.view.phone.MainMenu", {
  extend: 'Ext.Container',
  requires: ['Ext.Button'],
  xtype: 'iconmenu',
  config: {
  	store: 'MenuOptions',
  	itemsPerRow: 3,
  	layout: 'vbox',
	align: 'stretch',
	cls: 'phonehomepage'
  },
  
  generateMenuItems: function() {
		var menuStore = Ext.getStore(this.getStore());
		var menuOpts = menuStore.getCount();
		var menuItems = [];
		var itemsPerRow = this.getItemsPerRow();
		var currentRow = {};
		var btnText = "";
		for (var i=0; i<menuOpts; i++) {
			if (i % itemsPerRow == 0) {
				currentRow = {
					xtype: 'container',
					layout: 'hbox',
					flex: 1,
					align: 'stretch',
					items: []
				}
			}
		
			btnText = menuStore.getAt(i).get("title");
			if (itemsPerRow > 3) {
				var loc = btnText.indexOf(' ');
				if (loc > 0)
				  btnText = btnText.substring(0,loc);
			}
			
			
			
			currentRow.items[currentRow.items.length] = {
				xtype: 'button',
				flex:1,
				align: 'stretch',
				text: btnText,
				iconCls: menuStore.getAt(i).get("iconCls"),
				iconMask: true,
				iconAlign: 'top',
				ui: 'plain',
				route: menuStore.getAt(i).get('route')
			}
			if (i % itemsPerRow == 0) {
				menuItems[menuItems.length] = currentRow;
			}
		};
		return menuItems;
	},
  
  
  initialize: function() {
  	if (Ext.Viewport.getOrientation() == "landscape") {
  		this.setItemsPerRow(5);
  	}
  	this.add(this.generateMenuItems());
  }
});