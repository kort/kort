Ext.define('CrimeFinder.controller.News', {
	extend : 'Ext.app.Controller',
	requires : 'Ext.data.proxy.LocalStorage',

	config : {

		views : [
			'CrimeFinder.view.news.fbi.List', 
			'CrimeFinder.view.news.fbi.Detail',
			'CrimeFinder.view.news.confess.List',
			'CrimeFinder.view.news.confess.Detail'
		],

		refs : {
			'newsTypeSelector' : 'newsnav',
			'missingKidsContainer' : 'missingkids',
			'newsContainer' : 'news',
			'confessionList' : 'confesslist'
		},
		control : {

			'fbipersons' : {
				initialize : 'onFbiPersonsInitialize',
				itemtap : 'onFbiPersonsTap'
			},
			
			'newsTypeSelector' : {
				itemtap : 'onNewsNavTap'
			},
			
			'confessionList' : {
				itemtap : 'onConfessListTap'
			},

			'newsContainer' : {
				pop : 'onNewsContainerPop'
			}

		}
	},

	onFbiPersonsInitialize : function(obj, e) {
		
		var bUseCache = true;
		

		var FbiPersonStore = Ext.create("Ext.data.Store", {
			model : 'CrimeFinder.model.FbiRssItem',
			proxy : {
				type : 'jsonp',
				url : CrimeFinder.config.Constants.fbiRssUrl + obj.getUrl()
			},
			grouper : {
				groupFn : function(record) {
					return record.get('LASTNAME')[0];
				}
			}
		});

		obj.setStore(FbiPersonStore);

		// exercise 8-1
		var localStorageId = obj.getTitle().replace(' ', "-");

		if(!bUseCache) {
			for(var i in window.localStorage) {
				if(i.indexOf(localStorageId) == 0) {
					window.localStorage.removeItem(i);
				}
			}
			FbiPersonStore.load({
				scope : this,
				callback : function(records, operation) {
					FbiPersonStore.getModel().setProxy({
						type : 'localstorage',
						id : localStorageId
					})
					for(var i = 0; i < FbiPersonStore.getCount(); i++) {
						FbiPersonStore.getAt(i).save();
					}
				}
			})
		} else {
			FbiPersonStore.getModel().setProxy({
				type : 'localstorage',
				id : localStorageId
			});
			FbiPersonStore.load();
		}

	},
	
	onNewsContainerPop : function(objNavView, objView, eOpts) {
		if (objView._store)
		  Ext.data.StoreManager.unregister(objView.getStore());
		objView.destroy();
	},
	
	onNewsNavTap : function(list, index, item, rec, e) {
		var me = this;
	
		var bUseCache = false;

		if(rec.get('id') == 0) {
			Ext.getStore('Confessions').load({
				scope : this,
				callback : function(records, operation) {
					this.getNewsContainer().push({
						xtype : 'confesslist',
						title : 'Crime Feed!'
					});
				}
			});
		} else {
			list.up('navigationview').push({
				xtype : rec.get('view'),
				title : rec.get('label'),
				url : rec.get('url')
			});
		}
	},
	
	onFbiPersonsTap : function(list, index, item, rec, e) {
        list.up('navigationview').push({
            xtype : 'fbipersonsdetail',
            title : rec.get('TITLE'),
            data : {DESCRIPTION: rec.get('DESCRIPTION')}
        });
    },
	
	onConfessListTap : function(list, index, item, e) {

		var rec = list.getStore().getAt(index);
		var container = list.up('navigationview');

		container.push({
			xtype : 'confessdetail',
			title : 'Crime Detail',
			data : rec.data
		});
	}
});
