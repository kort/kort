/**
 * Model for a validation
 */

function determineMissionState(v, record) {
    return record.data.campaign_id ? Kort.util.Config.getMissionState().validationCampaign : Kort.util.Config.getMissionState().validation;
}

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
            { name: 'formatted_distance', type: 'string' },
            { name: 'validation_koin_count', type: 'int' },
            { name: 'state', convert:determineMissionState}

        ]
    }
});