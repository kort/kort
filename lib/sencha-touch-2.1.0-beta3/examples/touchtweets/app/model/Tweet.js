/**
 * @class Twitter.model.Tweet
 * @extends Ext.data.Model
 *
 * The Tweet model uses a custom Twitter proxy (defined in lib/TwitterProxy.js as it is not part of a particular app).
 * The Twitter application doesn't use this model directly very much, relying instead on the hasMany association with
 * the Search model to load the Tweets for a given Search.
 */
Ext.define('Twitter.model.Tweet', {
    extend: 'Ext.data.Model',
    requires: 'Twitter.proxy.Twitter',

    config: {
        fields: [
            {name: "id",                type: "int"},
            {name: "text",              type: "string"},
            {name: "from_user",         type: "string"},
            {name: "profile_image_url", type: "string"},
            {name: "created_at",        type: "string"},
            {name: "metadata"},
            {name: 'search_id'}
        ],

        proxy: {
            type: 'twitter'
        }
    }
});
