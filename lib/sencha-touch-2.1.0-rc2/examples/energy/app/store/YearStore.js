Ext.define("EnergyApp.store.YearStore", {
    extend: "Ext.data.JsonStore",
    alias: 'store.YearStore',
    config: {
        fields: ['type', 'data']
    }
});