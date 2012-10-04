/**
 * The Search model uses localStorage to save the user's searches. As each Search consists of a number of Tweets, we
 * set up a hasMany association between this and the Tweet model. Even though the Tweet model uses a different proxy
 * (loading its data from twitter.com instead of localStorage), the hasMany association to Tweet still works. See the
 * 'show' action in app/controllers/search.js to see the association in use.
 */
Ext.define('Twitter.model.Search', {
    extend: 'Ext.data.Model',
    requires: ['Twitter.model.Tweet', 'Ext.data.identifier.Uuid'],

    config: {
        identifier: 'uuid',

        fields: [
            { name: "id" },
            { name: "query", type: "string" }
        ],

        hasMany: {
            model: "Twitter.model.Tweet",
            name : 'tweets',
            filterProperty: 'query',
            store: {
                pageSize       : 50,
                remoteFilter   : true,
                clearOnPageLoad: false
            }
        },

        proxy: {
            type: 'localstorage',
            id  : 'twitter-searches'
        }
    }
});