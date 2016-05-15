/**
 * Controller for mission markers on map.
 */
Ext.define('Kort.controller.MapMission', {
    extend: 'Kort.controller.MapAbstractType',
    requires: [
        'Kort.view.map.mission.MissionMessageBox',
        'Kort.view.map.mission.fix.TabPanel'
    ],
    config: {
        /**
         * @private
         * override REQUIRED from base class
         */
        dataStore: null,
        /**
         * @private
         * override REQUIRED from base class
         */
        dataStoreProxyURL: null
    },

    /**
     * @private
     */
    init: function() {
        this.setDataStore(Ext.getStore('Missions'));
        //call init function of parent AFTER having overidden or set the required properties
        this.callParent();

    },

    /**
     * Defines what to do after a user has clicked on a marker icon from this type.
     */
    onMarkerClickCallbackFunction: function() {
        Ext.create('Kort.view.map.mission.MissionMessageBox').confirm(this.getActiveRecord(), this._returnFromMissionMessageBox, this);
    },

    /**
     * Defines how the proxy url of the dataStore has to be updated before the markers are plot on the map or need to be updated.
     * This is nescessary if the underlying proxy depends on gps or current map center coordiantes.
     */
    updateDataStoreProxyUrl: function() {
        var coordinateSource = this.getCurrentLocationLatLng();
        this.setDataStoreProxyURL(Kort.util.Config.getWebservices().mission.getUrl(coordinateSource.lat, coordinateSource.lng));
    },

    /**
     * @private
     * Handels the answer from the mission message box.
     * @param {String} buttonId The itemId of the button pressed.
     * @param {String} value Value of the input field if either prompt or multiLine option is true.
     * @param {Object} opt The config object passed to show.
     * @param {Kort.model.Mission} record The corresponding model instance.
     */
    _returnFromMissionMessageBox: function(buttonId, value, opt,record) {
        if (buttonId==='yes') {
            this._showFix();
        }
        this.setActiveRecord(null);
    },

    /**
     * @private
     * Creates and displays the fix panel.
     */
    _showFix: function () {
        var fixTabPanel = Ext.create('Kort.view.map.mission.fix.TabPanel', {
            record: this.getActiveRecord(),
            title: this.getActiveRecord().get('title')
        });
        this.getMapNavigationView().push(fixTabPanel);
        this.getMapNavigationView().fireEvent('detailpush', this.getMapNavigationView());
    }
});
