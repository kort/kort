/**
 * Represents a Bill
 *
 * Field documentation is available here:
 * http://services.sunlightlabs.com/docs/Real_Time_Congress_API/bills/
 */
Ext.define('GeoCon.model.Bill', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
            { name: 'abbreviated',          type: 'boolean' },
            { name: 'actions',              type: 'object' },
            { name: 'awaiting_signature',   type: 'boolean' },
            { name: 'bill_id',              type: 'string' },
            { name: 'bill_type',            type: 'string' },
            { name: 'chamber',              type: 'string' },
            { name: 'code',                 type: 'string' },
            { name: 'committees',           type: 'object' },
            { name: 'cosponsor_ids',        type: 'object' },
            { name: 'cosponsors',           type: 'object' },
            { name: 'cosponsors_count',     type: 'number' },
            { name: 'enacted',              type: 'boolean' },
            { name: 'introduced_at',        type: 'date' },
            { name: 'keywords',             type: 'object' },
            { name: 'last_action',          type: 'object' },
            { name: 'last_action_at',       type: 'date' },
            { name: 'last_passage_vote_at', type: 'date' },
            { name: 'last_version',         type: 'object' },
            { name: 'last_version_on',      type: 'string' },
            { name: 'number',               type: 'number' },
            { name: 'official_title',       type: 'string' },
            { name: 'passage_votes',        type: 'object' },
            { name: 'passage_votes_count',  type: 'number' },
            { name: 'popular_title',        type: 'string' },
            { name: 'related_bills',        type: 'object' },
            { name: 'session',              type: 'number' },
            { name: 'short_title',          type: 'string' },
            { name: 'sponsor',              type: 'object' },
            { name: 'sponsor_id',           type: 'string' },
            { name: 'state',                type: 'string' },
            { name: 'summary',              type: 'string' },
            { name: 'titles',               type: 'object' },
            { name: 'version_codes',        type: 'object' },
            { name: 'version_info',         type: 'object' },
            { name: 'versions_count',       type: 'number' },
            { name: 'vetoed',               type: 'boolean' }
        ]
    }
});
