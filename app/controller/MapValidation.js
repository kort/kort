/**
 * Controller for validation markers on map.
 */
Ext.define('Kort.controller.MapValidation', {
    extend: 'Kort.controller.MapAbstractType',
    requires: [
        'Kort.view.map.validation.ValidationMessageBox',
        'Kort.view.map.validation.Container'
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
        this.setLLayerGroupName(Ext.i18n.Bundle.message('map.validation.layername'));
        this.setDataStore(Ext.getStore('Validations'));
        this.setPromotionStore(Ext.getStore('Promotions'));
        this._loadPromotionStore();
        this.setPromotionOverlayBackground(Ext.create('Kort.view.map.mission.PromotionOverlay'));
        //call init function of parent AFTER having overidden the required properties
        this.callParent();
    },

    /**
     * Defines what to do after a user has clicked on a marker icon from this type.
     */
    onMarkerClickCallbackFunction: function() {
        Ext.create('Kort.view.map.validation.ValidationMessageBox').confirm(this.getActiveRecord(), this._returnFromValidationMessageBox, this);
        if(this.getActiveRecord().get('state') === Kort.util.Config.getMapMarkerState().validationPromotion) {
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
        //ToDo Refactor
        this.setDataStoreProxyURL(Kort.util.Config.getWebservices().validation.getUrl(coordinateSource.lat, coordinateSource.lng));
    },

    /**
     * @private
     * Handels the answer from the validation message box.
     * @param {String} buttonId The itemId of the button pressed.
     * @param {String} value Value of the input field if either prompt or multiLine option is true.
     * @param {Object} opt The config object passed to show.
     */
    _returnFromValidationMessageBox: function(buttonId, value, opt){
        if(this.getActiveRecord().get('state') === Kort.util.Config.getMapMarkerState().validationPromotion) {
            this.getLMapWrapper().remove(this.getPromotionOverlayBackground(),false);
        }
        if (buttonId === 'yes'){
            this._showVote();
        }
        this.setActiveRecord(null);
    },

    /**
     * @private
     * Show details about the record's corresponding promotion.
     * This function is called from within Kort.view.map.validation.ValidationMessageBox (promotion state) after a click on the info button has been detected.
     * This is done this way because the info button has to be registered from within the view.
     */
    _showPromotionMessageBox: function () {
        Kort.view.map.validation.ValidationMessageBox.preventOpening=true;
        Ext.create('Kort.view.map.validation.ValidationMessageBox').confirm(this.getPromotionStore().getById(this.getActiveRecord().get('campaign_id')), Ext.emptyFn, this, this.getActiveRecord().get('campaign_extra_coins'));
    },

    /**
     * @private
     * Creates and displays the vote panel.
     */
    _showVote: function() {
        var voteContainer = Ext.create('Kort.view.map.validation.Container', {
            record: this.getActiveRecord(),
            title: this.getActiveRecord().get('title')
        });
        this.getMapNavigationView().push(voteContainer);
        this.getMapNavigationView().fireEvent('detailpush', this.getMapNavigationView());
    },

    /**
     * @private
     */
    _loadPromotionStore: function() {
        //ToDo Relink PromotionStore to Webservice-URL - waiting for MWO
        this.getPromotionStore().load();
    }
});