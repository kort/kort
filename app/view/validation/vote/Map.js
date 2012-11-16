Ext.define('Kort.view.validation.vote.Map', {
	extend: 'Ext.ux.LeafletMap',
	alias: 'widget.votemap',
    
	config: {
        title: Ext.i18n.Bundle.message('vote.map.title'),
        mapOptions: {
            zoom: Kort.util.Config.getLeafletMap().zoom
        },
        tileLayerUrl: Kort.util.Config.getLeafletMap().tileLayerUrl,
        tileLayerOptions: {
            apikey: Kort.util.Config.getLeafletMap().apiKey,
            styleId: Kort.util.Config.getLeafletMap().styleId
        }
	}
});
