Ext.define("CrimeFinder.view.crimereport.PieChart", {
	extend : 'Ext.chart.Panel',
	xtype : 'crimepiechart',
	requires : ['Ext.chart.Panel', 'Ext.chart.axis.Numeric', 'Ext.chart.axis.Category', 'Ext.chart.series.Pie'],
	config : {
		title : 'Analysis'
	},

	initialize : function() {
		this.setItems([{
			store : Ext.getStore('CrimeReports').getCountStore(),
			shadow : false,
			animate : true,
			insetPadding : 20,
			legend : {
				position : {
					portrait : 'bottom',
					landscape : 'left'
				}
			},
			interactions : [{
				type : 'reset',
				confirm : true
			}, {
				type : 'rotate'
			}, 
			'itemhighlight', 
			{
				type : 'iteminfo',
				gesture : 'longpress',
				listeners : {
					show : function(interaction, item, panel) {
						var storeItem = item.storeItem;
						panel.setHtml(storeItem.get('label') + ' : ' + storeItem.get('count'));
					}
				}
			}],
			series : [{
				type : 'pie',
				field : 'count',
				showInLegend : true,
				label : {
					field : 'label',
					display : 'rotate',
					contrast : true,
					font : '12px Arial'
				}
			}]
		}]);
	}
});
