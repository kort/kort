/*jshint maxcomplexity:10 */
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
            { name: 'secret', type: 'string' }
        ],
        
		proxy: {
			type: 'rest',
            url: './server/webservices/user',
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
                    userBadges.getProxy().setUrl('./server/webservices/user/' + user.get('id') + '/badges');
                    userBadges.load();
                    if(typeof callback === 'function') {
                        scope = scope || this;
                        callback.call(scope);
                    }
                }
            });
        }
    }
});