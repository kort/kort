/**
 * Controller for mission markers on map.
 */
Ext.define('Kort.controller.MapMission', {
    extend: 'Kort.controller.MapAbstractType',
    requires: [
        'Kort.view.map.mission.PromotionOverlay',
        'Kort.view.map.mission.MissionMessageBox',
        'Kort.view.map.mission.fix.TabPanel',
        'Kort.view.map.mission.PromotionMessageBox'
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
        dataStoreProxyURL: null,
        /**
         * @private
         * override REQUIRED from base class
         */
        lLayerGroupName:null,
        /**
         * @private
         */
        promotionOverlayBackground:null,
        /**
         * @private
         */
        promotionStore: null
    },

    /**
     * @private
     */
    init: function() {
        this.setLLayerGroupName(Ext.i18n.Bundle.message('map.mission.layername'));
        this.setDataStore(Ext.getStore('Missions'));
        this.setPromotionStore(Ext.getStore('Promotions'));
        this._loadPromotionStore();
        this.setPromotionOverlayBackground(Ext.create('Kort.view.map.mission.PromotionOverlay'));
        //call init function of parent AFTER having overidden or set the required properties
        this.callParent();

    },

    /**
     * Defines what to do after a user has clicked on a marker icon from this type.
     */
    onMarkerClickCallbackFunction: function() {
        Ext.create('Kort.view.map.mission.MissionMessageBox').confirm(this.getActiveRecord(), this._returnFromMissionMessageBox, this);
        if(this.getActiveRecord().get('state')===Kort.util.Config.getMapMarkerState().missionPromotion) {
            this.getLMapWrapper().add(this.getPromotionOverlayBackground());
        }
    },

    /**
     * Defines how the proxy url of the dataStore has to be updated before the markers are plot on the map or need to be updated.
     * This is nescessary if the underlying proxy depends on gps or current map center coordiantes.
     * @param {Boolean} useMapCenterInsteadOfGPS
     */
    updateDataStoreProxyUrl: function(useMapCenterInsteadOfGPS) {
        var coordinateSource = (useMapCenterInsteadOfGPS && this.getLMapWrapper()) ? this.getLMapWrapper().getMapCenter() : this.getCurrentLocationLatLng();
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
        if(this.getActiveRecord().get('state')===Kort.util.Config.getMapMarkerState().missionPromotion) {
            this.getLMapWrapper().remove(this.getPromotionOverlayBackground(),false);
        }
        if (buttonId==='yes') {
            this._showFix();
        }
        this.setActiveRecord(null);
    },

    /**
     * @private
     * Show details about the record's corresponding promotion.
     * This function is called from within Kort.view.map.mission.PromotionMessageBox after a click on the info button has been detected.
     * This is done this way because the info button has to be registered from within the view.
     */
    _showPromotionMessageBox: function () {
        Kort.view.map.mission.MissionMessageBox.preventOpening=true;
        Ext.create('Kort.view.map.mission.PromotionMessageBox').confirm(this.getPromotionStore().getById(this.getActiveRecord().get('promo_id')), Ext.emptyFn, this, this.getActiveRecord().get('extra_coins'));
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
    },

    /**
     * @private
     */
    _loadPromotionStore: function() {
        this.getPromotionStore().load();
    }
});
