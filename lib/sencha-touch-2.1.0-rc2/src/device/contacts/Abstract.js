/**
 * @private
 */
Ext.define('Ext.device.contacts.Abstract', {
    extend: 'Ext.Evented',
    
    /**
     * Returns an Array of contact objects.
     * @return {Object[]} An array of contact objects.
     */
    getContacts: function(config) {
        if (!this._store) {
            this._store = [
                {
                    first: 'Robert',
                    last: 'Dougan',
                    emails: {
                        work: 'rob@sencha.com'
                    }
                },
                {
                    first: 'Jamie',
                    last: 'Avins',
                    emails: {
                        work: 'jamie@sencha.com'
                    }
                }
            ];
        }

        config.success.call(config.scope || this, this._store);
    },

    getLocalizedLabel: function(config) {
        config.callback.call(config.scope || this, config.label.toUpperCase(), config.label);
    }
});
