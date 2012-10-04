Ext.define('Kiva.store.Loans', {
    extend: 'Ext.data.Store',

    config: {
        model: 'Kiva.model.Loan',
        autoLoad: true,
        remoteFilter: true
    }
});
