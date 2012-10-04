Ext.define('Kiva.view.detail.Map', {
    extend: 'Ext.Map',
    xtype: 'detailMap',
    config: {
        mapOptions: {
            // center: this.mapPosition,
            disableDefaultUI: true,
            zoom: 5,
            draggable: false
        }
	}
});
