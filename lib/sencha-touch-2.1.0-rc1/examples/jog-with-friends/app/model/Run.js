/**
 * A Run model
 */
Ext.define('JWF.model.Run', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
            { name: 'location',  type: 'string' },
            { name: 'date',      type: 'date' },
            { name: 'distance',  type: 'number' },
            { name: 'profileId', type: 'string' },
            { name: 'name',      type: 'string' }
        ]
    }
});
