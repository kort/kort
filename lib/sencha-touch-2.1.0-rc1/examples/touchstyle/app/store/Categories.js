Ext.define('TouchStyle.store.Categories', {
    extend: 'Ext.data.TreeStore',
    requires: ['TouchStyle.model.Category'],

    config :{
        model: 'TouchStyle.model.Category',
        autoLoad: true,
        root: {
            expanded: true
        }
    }
});
