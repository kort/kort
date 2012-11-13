Ext.define('Kort.view.bugmap.fix.SubmittedPopupPanel', {
	extend: 'Ext.Panel',
	alias: 'widget.fixsubmittedpopuppanel',
	
	config: {
        cls: 'fixSubmittedPopupPanel',
		centered: true,
        zIndex: Kort.util.Config.getZIndex().overlayLeafletMap,
		showAnimation: {
			type: 'pop',
			duration: 150
		},
		hideAnimation: {
			type: 'popOut',
			duration: 150
		},
		
		html:	'<div class="content">' +
					'<p>' + Ext.i18n.Bundle.message('fix.submitted.message') + '</p>' +
				'</div>',
		
		listeners: {
			show: function(panelComp, eOpts) {
				// automatically hide panel after certain time
				Ext.defer(function() {
					this.hide();
				}, 2000, this);
			},
            hide: function() {
                this.destroy();
            }
		}
	}
});