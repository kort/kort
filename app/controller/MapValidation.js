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
        dataStoreProxyURL: null
    },

    /**
     * @private
     */
    init: function() {
        this.setDataStore(Ext.getStore('Validations'));
        //call init function of parent AFTER having overidden the required properties
        this.callParent();
    },

    /**
     * Defines what to do after a user has clicked on a marker icon from this type.
     */
    onMarkerClickCallbackFunction: function() {
        Ext.create('Kort.view.map.validation.ValidationMessageBox').confirm(this.getActiveRecord(), this._returnFromValidationMessageBox, this);
    },

    /**
     * Defines how the proxy url of the dataStore has to be updated before the markers are plot on the map or need to be updated.
     * This is nescessary if the underlying proxy depends on gps or current map center coordiantes.
     */
    updateDataStoreProxyUrl: function() {
        var coordinateSource = this.getCurrentLocationLatLng();
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
        if (buttonId === 'yes'){
            this._showVote();
        }
        this.setActiveRecord(null);
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
    }
});