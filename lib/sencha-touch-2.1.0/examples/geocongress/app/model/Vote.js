Ext.define('GeoCon.model.Vote', {
    extend: 'Ext.data.Model',
    requires: 'Ext.DateExtras',

    config: {
        fields: [
            { name: 'bill_id',        type: 'string' },
            { name: 'chamber',        type: 'string' },
            { name: 'how',            type: 'string' },
            { name: 'number',         type: 'number' },
            { name: 'passage_type',   type: 'string' },
            { name: 'question',       type: 'string' },
            { name: 'required',       type: 'string' },
            { name: 'result',         type: 'string' },
            { name: 'roll_id',        type: 'string' },
            { name: 'roll_type',      type: 'string' },
            { name: 'session',        type: 'number' },
            { name: 'vote_breakdown', type: 'object' },
            { name: 'vote_type',      type: 'string' },
            { name: 'voted_at',       type: 'date' },
            {
                name: 'voted_at_str',
                type: 'string',
                convert: function(v, record) {
                    return Ext.Date.format(record.data.voted_at, 'F j, Y');
                }
            },
            { name: 'voter_ids',      type: 'object' },
            { name: 'year',           type: 'number' }
        ]
    }
});


