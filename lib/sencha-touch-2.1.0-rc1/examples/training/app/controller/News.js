Ext.define('CrimeFinder.controller.News', {
	extend : 'Ext.app.Controller',
	requires : 'Ext.data.proxy.LocalStorage',
	FbiPersonStore : null,

	config : {
		models: [
		 'CrimeFinder.model.FbiRssItem'
		],
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
		
		var bUseCache = false;
		
		if(this.FbiPersonStore) {
			Ext.data.StoreManager.unregister(this.FbiPersonStore);
		}

		this.FbiPersonStore = Ext.create("Ext.data.Store", {
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

		obj.setStore(this.FbiPersonStore);

		// exercise 8-1
		var localStorageId = obj.getTitle().replace(' ', "-");

		if(!bUseCache) {
			for(var i in window.localStorage) {
				if(i.indexOf(localStorageId) == 0) {
					window.localStorage.removeItem(i);
				}
			}
			this.FbiPersonStore.load({
				scope : this,
				callback : function(records, operation) {
					this.FbiPersonStore.getModel().setProxy({
						type : 'localstorage',
						id : localStorageId
					})
					for(var i = 0; i < this.FbiPersonStore.getCount(); i++) {
						this.FbiPersonStore.getAt(i).save();
					}
				}
			})
		} else {
			this.FbiPersonStore.getModel().setProxy({
				type : 'localstorage',
				id : localStorageId
			});
			this.FbiPersonStore.load();
		}

	},
	
	onNewsContainerPop : function(objNavView, objView, eOpts) {
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
