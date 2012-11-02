Ext.define('Kort.view.bugmap.fix.Map', {
	extend: 'Ext.ux.LeafletMap',
	alias: 'widget.fixmap',
    
	config: {
        title: Ext.i18n.Bundle.message('fix.map.title'),
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
