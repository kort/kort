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
			{ name: 'fixmessage', type: 'string' },
			{ name: 'falsepositive', type: 'boolean' },
            { name: 'upratings', type: 'int' },
            { name: 'downratings', type: 'int' },
            { name: 'required_votes', type: 'int' },
            { name: 'latitude', type: 'string' },
            { name: 'longitude', type: 'string' },
            { name: 'distance', type: 'int' },
            { name: 'formatted_distance', type: 'string' }
        ]
    }
});