Ext.define('Kort.view.bugmap.fix.Map', {
	extend: 'Ext.ux.LeafletMap',
	alias: 'widget.fixmap',
    
	config: {
        title: Ext.i18n.Bundle.message('fix.map.title'),
        mapOptions: {
            zoom: 15
        },
        tileLayerUrl: 'http://{s}.tile.cloudmade.com/{apikey}/{styleId}/256/{z}/{x}/{y}.png',
        tileLayerOptions: {
            apikey: '729242682cb24de8aa825c8aed993cba',
            styleId: 997
        }
	}
});
