Ext.define('EnergyApp.model.NavigationModel', {
    extend: "Ext.data.Model",
    config: {
        fields: [
            {name: 'key', type: 'string'},
            {name: 'label', type: 'string'}
        ]
    }
});