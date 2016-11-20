/**
 * Model for the user instance
 */
Ext.define('Kort.model.User', {
    extend: 'Ext.data.Model',
    config: {
		idProperty: 'id',

        fields: [
			{ name: 'id', type: 'auto' },
			{ name: 'name', type: 'string' },
			{ name: 'username', type: 'string' },
			{ name: 'oauth_user_id', type: 'string' },
			{ name: 'oauth_provider', type: 'string' },
            { name: 'pic_url', type: 'string' },
			{ name: 'logged_in', type: 'boolean' },
			{ name: 'token', type: 'string' },
			{ name: 'fix_count', type: 'int' },
			{ name: 'vote_count', type: 'int' },
			{ name: 'koin_count', type: 'int' },
			{ name: 'ranking', type: 'int' },
            { name: 'rownumber', type: 'int' },
            { name: 'secret', type: 'string' }
        ],
        
		proxy: {
			type: 'rest',
            url: Kort.util.Config.getWebservices().user.getUrl(),
            pageParam: false,
            startParam: false,
            limitParam: false,
            reader: {
                type: 'json',
                rootProperty: 'return'
            }
        }
    },
    
    statics: {
        reload: function(user, idProperty, callback, scope) {
            this.load(user.get(idProperty), {
                success: function(record, operation) {
                    var userBadges = Ext.getStore('UserBadges'),
                        property;
                    
                    for (property in record.getData()) {
                        if (user.hasOwnProperty(property)) {
                            user.set(property, record.getData()[property]);
                        }
                    }

                    // loading badges of user
                    userBadges.getProxy().setUrl(Kort.util.Config.getWebservices().userBadges.getUrl(user.get('id')));
                    userBadges.load();
                    if(typeof callback === 'function') {
                        scope = scope || this;
                        callback.call(scope);
                    }
                    Kort.app.fireEvent('userrefreshed');
                }
            });
        }
    }
});