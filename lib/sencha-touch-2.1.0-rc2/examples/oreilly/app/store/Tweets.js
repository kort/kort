Ext.define('Oreilly.store.Tweets', {
    extend: 'Ext.data.Store',

    config: {
        fields: ['from_user', 'profile_image_url', 'text', 'created_at'],

        pageSize: 10,

        proxy: {
            type: 'jsonp',
            url: 'http://search.twitter.com/search.json',

            pageParam: 'page',
            limitParam: 'rpp',

            reader: {
                type: 'json',
                rootProperty: 'results'
            }
        }
    }
});
