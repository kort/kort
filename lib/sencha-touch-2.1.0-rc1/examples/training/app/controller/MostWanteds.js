Ext.define('CrimeFinder.controller.MostWanteds', {
	extend : 'Ext.app.Controller',

	config : {
		refs : {
			mostwantedlist : 'mostwanteds'
		},
		
		control : {
			'mostwantedlist' : {
				leafitemtap : 'mostWantedTap'
			}
		}
	},

	mostWantedTap : function(nestedList, list, index, target, record, e, eOpts) {
		var detailCard = nestedList.getDetailCard();
		detailCard.setHtml('<div class="toptenrecord">' + record.get('desc') + "</div>");
	}
});
