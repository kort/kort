Ext.define("CrimeFinder.view.crimereport.List", {
    extend: 'Ext.Container',
    xtype: 'crimelist',
   
    config: {
       layout: { type: 'vbox'},
       items: [
        
        {
        	xtype: 'container',
        	id: 'streetview',
        	flex: 2,
        	html: '<div align="center">Please make a selection</div>',
        	margins: '5 5 5 5'
        },
         {
        	 xtype: 'dataview',
        	 store: 'CrimeReports',
        	 margins: '5 5 5 5',
        	 flex: 1,
        	 itemTpl: '<div class="crimereport"><div>{[Ext.util.Format.date(values.REPORTDATE, "Y-m-d H:i")]} - {OFFENSE} : <br /> {ADDRESS} <br /> {[Ext.String.ellipsis(values.DESCRIPTION,55)]}</div></div>',
        	 selectedCls: 'crimereportSelected'
        }
       ]
        /*
        items: [{
            xtype: 'toolbar',
            docked: 'top',
            layout: {
                pack: 'center'
            },
            items: [{
                xtype: 'segmentedbutton',
                items: [{
                    text: 'Sort by Type',
                    pressed: true,
                    action: 'sortbytype'
                }, {
                    text: 'Sort by Date',
                    action: 'sortbydate'
                }]
            }]
        }]
        */
    }
});
