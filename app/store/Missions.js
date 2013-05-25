/**
 * Store for missions.
 */
Ext.define('Kort.store.Missions', {
    extend: 'Ext.data.Store',
    config: {
        autoLoad: false,
        model: 'Kort.model.Mission',
        proxy: {
            type: 'rest',
            url: './resources/stores/missions.json',
            pageParam: false,
            startParam: false,
            extraParams: {
                'lang': Kort.util.Config.getLanguage(),
                'limit': Kort.util.Config.getWebservices().mission.limit,
                'radius': Kort.util.Config.getWebservices().mission.radius
            },
            reader: {
                type: 'json',
                rootProperty: 'return'
            }
        }
    },

    /**
     * For each mission in store, calculate if it is in the operational range and therefore solvable.
     * @param {Kort.util.Geolocation} geo The geolocation object which holds the current user position.
     * @param {number} distance The radius of the operational range.
     */
    doOperationalRangeCheck: function (geo, distance) {
        if (!this.isLoading()) {
            this.each(function (record, index, length) {
                record.set('inOperationalRange', (geo.getDistance(record.get('latitude'), record.get('longitude')) < distance) ? true : false);
            });
        }
    }

});
