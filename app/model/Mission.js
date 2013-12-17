/**
 * Model for a mission
 */
Ext.define('Kort.model.Mission', {
    extend: 'Ext.data.Model',
    config: {
		idProperty: 'id',
		
        fields: [
			{ name: 'id', type: 'auto' },
			{ name: 'schema', type: 'string' },
			{ name: 'type', type: 'string' },
			{ name: 'osm_id', type: 'int' },
			{ name: 'osm_type', type: 'string' },
			{ name: 'title', type: 'string' },
			{ name: 'description', type: 'string' },
            { name: 'latitude', type: 'string' },
            { name: 'longitude', type: 'string' },
            { name: 'view_type', type: 'string' },
            { name: 'answer_placeholder', type: 'string' },
            { name: 'fix_koin_count', type: 'int' },
            { name: 'promo_id', type: 'int' },
            { name: 'extra_coins', type: 'int' },
            { name: 'state', convert:function(v, record) {
                return (record.data.promo_id && record.data.extra_coins !== 0) ? Kort.util.Config.getMapMarkerState().missionPromotion : Kort.util.Config.getMapMarkerState().mission;
            }},
            { name: 'inOperationalRange', type: 'boolean', defaultValue: true}
        ]
    }
});