/**
 * Model for a fix
 */
Ext.define('Kort.model.Fix', {
    extend: 'Ext.data.Model',
    config: {
		idProperty: 'id',
		
        fields: [
			{ name: 'id', type: 'auto' },
			{ name: 'user_id', type: 'int' },
			{ name: 'error_id', type: 'string' },
			{ name: 'schema', type: 'string' },
			{ name: 'osm_id', type: 'int' },
			{ name: 'message', type: 'string' },
			{ name: 'falsepositive', type: 'string' }
        ],
        
		proxy: {
			type: 'rest',
            url: Kort.util.Config.getWebservices().fix.getUrl()
		}
    }
});