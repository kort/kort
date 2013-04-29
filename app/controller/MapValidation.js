/**
 * Controller for validations on map
 */
Ext.define('Kort.controller.MapValidation', {
    extend: 'Kort.controller.MapAbstractType',
    requires: [
        'Kort.view.map.validation.ValidationMessageBox',
        'Kort.view.map.validation.Container'
    ],
    config: {
        //override required from base class
        name:null,
        //override required from base class
        dataStore: null,
        //override required from base class
        dataStoreProxyURL: null,
        //override required from base class
        lLayerGroup: null,
        //override required from base class
        lLayerGroupName:null,

        promotionOverlayBackground:null,

        promotionStore: null
    },

    init: function() {
        this.setLLayerGroup(L.layerGroup());
        this.setLLayerGroupName(Ext.i18n.Bundle.message('map.validation.layername'));
        this.setDataStore(Ext.getStore('Validations'));
        this.setPromotionStore(Ext.getStore('Promotions'))
        this._loadPromotionStore();
        this.setPromotionOverlayBackground(Ext.create('Kort.view.map.mission.PromotionOverlay'));
        //call init function of parent class not until having overridden required configs
        this.callParent()
    },

    onMarkerClickCallbackFunction: function() {
        Ext.create('Kort.view.map.validation.ValidationMessageBox').confirm(this.getActiveRecord(), this.returnFromValidationMessageBox, this);
        if(this.getActiveRecord().get('state')==Kort.util.Config.getMapMarkerState().validationPromotion) {
            this.getLMapWrapper().add(this.getPromotionOverlayBackground());
        }
    },

    updateDataStoreProxyUrl: function(useMapCenterInsteadOfGPS) {
        var coordinateSource = (useMapCenterInsteadOfGPS && this.getLMapWrapper()) ? this.getLMapWrapper().getMapCenter() : this.getCurrentLocationLatLng();
        //ToDo Refactor
        this.setDataStoreProxyURL(Kort.util.Config.getWebservices().bug.getUrl(coordinateSource.lat, coordinateSource.lng));
    },

    updateDataStoreProxyUrl: function(useMapCenterInsteadOfGPS) {
        var coordinateSource = (useMapCenterInsteadOfGPS && this.getLMapWrapper()) ? this.getLMapWrapper().getMapCenter() : this.getCurrentLocationLatLng();
        //ToDo Refactor
        this.setDataStoreProxyURL(Kort.util.Config.getWebservices().validation.getUrl(coordinateSource.lat, coordinateSource.lng));
    },

    returnFromValidationMessageBox: function(buttonId, value, opt){
        if(this.getActiveRecord().get('state')==Kort.util.Config.getMapMarkerState().validationPromotion) {
            this.getLMapWrapper().remove(this.getPromotionOverlayBackground(),false);
        }
        if (buttonId === 'yes'){
            this._showVote();
        }
        this.setActiveRecord(null);
    },

    showPromotionMessageBox: function () {
        Kort.view.map.validation.ValidationMessageBox.preventOpening=true;
        Ext.create('Kort.view.map.validation.ValidationMessageBox').confirm(this.getPromotionStore().getById(this.getActiveRecord().get('campaign_id')), Ext.emptyFn, this, this.getActiveRecord().get('campaign_extra_coins'));
    },

    _showVote: function() {
        var voteContainer = Ext.create('Kort.view.map.validation.Container', {
            record: this.getActiveRecord(),
            title: this.getActiveRecord().get('title')
        });
        this.getMapNavigationView().push(voteContainer);
        this.getMapNavigationView().fireEvent('detailpush', this.getMapNavigationView());
    },

    _loadPromotionStore: function() {
        //ToDo Relink PromotionStore to Webservice-URL - waiting for MWO
        this.getPromotionStore().load();
    }
});