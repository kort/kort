/**
 * Model for a campaign
 */
Ext.define('Kort.model.Campaign', {
    extend: 'Ext.data.Model',
    config: {
        idProperty: 'id',

        fields: [
            { name: 'id', type: 'auto' },
            { name: 'startdate', type: 'int' },
            { name: 'enddate', type: 'int' },
            { name: 'extra_coins', type: 'int' },
            { name: 'title', type: 'string' }
        ]
    }

});


