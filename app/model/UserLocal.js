/**
 * Model for the users secret which gets stored in local storage
 */
Ext.define('Kort.model.UserLocal', {
    extend: 'Ext.data.Model',
    requires: [
        'Ext.data.identifier.Uuid'
    ],
    
    config: {
        identifier: 'uuid',

        fields: [
			{ name: 'secret', type: 'string' },
            { name: 'newsAcceptedLanguageArray', type:'auto', defaultValue:Kort.util.Config.getSupportedLanguages()}
        ]
    }
});