Ext.define('GeoCon.model.Committee', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            { name: 'chamber',       type: 'string' },
            { name: 'id',            type: 'string' },
            { name: 'name',          type: 'string' },
            { name: 'subcommittees', type: 'string' }
        ]
    }
});
