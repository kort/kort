/**
 * Model for a validation
 */
Ext.define('Kort.model.Validation', {
    extend: 'Ext.data.Model',
    config: {
		idProperty: 'id',

        fields: [
			{ name: 'id', type: 'auto' },
			{ name: 'osm_id', type: 'int' },
			{ name: 'osm_type', type: 'string' },
			{ name: 'title', type: 'string' },
			{ name: 'type', type: 'string' },
			{ name: 'view_type', type: 'string' },
			{ name: 'question', type: 'string' },
            { name: 'bug_question', type: 'string' },
            { name: 'vote_koin_count', type: 'int' },
			{ name: 'fixmessage', type: 'string' },
			{ name: 'falsepositive', type: 'boolean' },
            { name: 'upratings', type: 'int' },
            { name: 'downratings', type: 'int' },
            { name: 'required_votes', type: 'int' },
            { name: 'latitude', type: 'string' },
            { name: 'longitude', type: 'string' },
            { name: 'formatted_distance', type: 'string' },
            { name: 'promo_id', type: 'int' },
            { name: 'extra_coins', type: 'int' },
            { name: 'state', convert:function(v, record) {
                return record.data.promo_id ? Kort.util.Config.getMapMarkerState().validationPromotion : Kort.util.Config.getMapMarkerState().validation;
            }},
            { name: 'inOperationalRange', type:'boolean', defaultValue:true }
        ]
    }
});