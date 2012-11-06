/**
 * The Runs store. Contains a list of all Runs the user and their friends have made.
 */
Ext.define('JWF.store.Runs', {
    extend  : 'Ext.data.Store',

    config: {
        model: 'JWF.model.Run',

        proxy: {
            type: 'jsonp',
            url: '/runs'
        }
    }
});
