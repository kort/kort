Ext.define("CrimeFinder.view.crimereport.CrimeReport", {
    extend: 'Ext.Container',
    requires: [
    	'CrimeFinder.view.crimereport.Map', 
    	'CrimeFinder.view.crimereport.List',
    	'CrimeFinder.view.crimereport.PieChart',
    	'Ext.field.Search',
    	'Ext.Button',
    	'Ext.Toolbar'
    ],
    xtype: 'crimereport',
    config: {
        layout: 'card',
        items: [{
           xtype: 'crimemap'
        }, {
        	  xtype: 'crimelist'
        },
        {
        	xtype: 'crimepiechart'
        },
          	{
            xtype: 'toolbar',
            docked: 'top',
            layout: {
                pack: 'center'
            },
            items: [{
                xtype: 'searchfield',
                name: 'searchAddress',
                width: '42%',
                placeHolder: 'DC Street Address'
            }, {
                xtype: 'button',
                text: 'Go',
                action: 'plotaddress'
            }, {
                xtype: 'button',
                iconCls: 'locate',
                iconMask: true,
                action: 'plotcurrentlocation'
            },
            {
                xtype: 'button',
                text: 'Detail',
                action: 'togglemode'
            }]
        }]
    }
});
