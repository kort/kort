/**
 * Controller for missions on map
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
        this.setLLayerGroupName(Ext.i18n.Bundle.message('map.mission.layername'));
        this.setDataStore(Ext.getStore('Missions'));
        this.setPromotionStore(Ext.getStore('Promotions'));
        this._loadPromotionStore();
        this.setPromotionOverlayBackground(Ext.create('Kort.view.map.mission.PromotionOverlay'));
        //call init function of parent class not until having overridden required configs
        this.callParent();

    },

    onMarkerClickCallbackFunction: function() {
        Ext.create('Kort.view.map.mission.MissionMessageBox').confirm(this.getActiveRecord(), this.returnFromMissionMessageBox, this);
        if(this.getActiveRecord().get('state')==Kort.util.Config.getMapMarkerState().missionPromotion) {
            this.getLMapWrapper().add(this.getPromotionOverlayBackground());
        }
    },

    updateDataStoreProxyUrl: function(useMapCenterInsteadOfGPS) {
        var coordinateSource = (useMapCenterInsteadOfGPS && this.getLMapWrapper()) ? this.getLMapWrapper().getMapCenter() : this.getCurrentLocationLatLng();
        //ToDo Refactor
        this.setDataStoreProxyURL(Kort.util.Config.getWebservices().bug.getUrl(coordinateSource.lat, coordinateSource.lng));
    },

    onMapMoveEnd: function() {
        this.updateDataStoreProxyUrl(true);
        this.triggerDataUpdate();
    },

    returnFromMissionMessageBox: function(buttonId, value, opt,record) {
        if(this.getActiveRecord().get('state')==Kort.util.Config.getMapMarkerState().missionPromotion) {
            this.getLMapWrapper().remove(this.getPromotionOverlayBackground(),false);
        }
        if (buttonId === 'yes') {
            this._showFix();
        }
        this.setActiveRecord(null);
    },

    showPromotionMessageBox: function () {
        Kort.view.map.mission.MissionMessageBox.preventOpening=true;
        Ext.create('Kort.view.map.mission.PromotionMessageBox').confirm(this.getPromotionStore().getById(this.getActiveRecord().get('campaign_id')), Ext.emptyFn, this, this.getActiveRecord().get('campaign_extra_coins'));
    },

    _showFix: function () {
        var fixTabPanel = Ext.create('Kort.view.map.mission.fix.TabPanel', {
            record: this.getActiveRecord(),
            title: this.getActiveRecord().get('title')
        });
        this.getMapNavigationView().push(fixTabPanel);
        this.getMapNavigationView().fireEvent('detailpush', this.getMapNavigationView());
    },

    _loadPromotionStore: function() {
        //ToDo Relink PromotionStore to Webservice-URL - waiting for MWO
        this.getPromotionStore().load();
    }



});
