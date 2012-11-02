Ext.define('Kort.view.bugmap.fix.SubmittedPopupPanel', {
	extend: 'Ext.Panel',
	alias: 'widget.fixsubmittedpopuppanel',
	
	config: {
		id: 'fixSubmittedPopupPanel',
		centered: true,
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