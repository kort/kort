Ext.define('Kort.view.SubmittedPopupPanel', {
	extend: 'Ext.Panel',
	alias: 'widget.submittedpopuppanel',
	
	config: {
        cls: 'submittedPopupPanel',
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
					'<p>' + Ext.i18n.Bundle.message('submitted.message') + '</p>' +
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