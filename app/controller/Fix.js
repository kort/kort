Ext.define('Kort.controller.Fix', {
    extend: 'Ext.app.Controller',

    config: {
        views: [
            'bugmap.fix.TabPanel',
            'bugmap.fix.Map',
            'bugmap.fix.Form',
			'bugmap.fix.SubmittedPopupPanel'
        ],
        refs: {
            bugmapNavigationView: '#bugmapNavigationView',
            fixTabPanel: '.fixtabpanel',
            fixFormSubmitButton: '.fixtabpanel .formpanel .button',
            fixField: '.fixtabpanel .formpanel .field',
            fixmap: '.fixtabpanel .fixmap'
        },
        control: {
            fixFormSubmitButton: {
                tap: 'onFixFormSubmitButtonTap'
            },
            fixField: {
                keyup: 'onFixFieldKeyUp'
            },
            fixmap: {
                maprender: 'onFixmapMaprender'
            }
        },

        bugsStore: null,
        map: null
    },

    init: function() {
        this.setBugsStore(Ext.getStore('Bugs'));
    },

    onFixmapMaprender: function(cmp, map, tileLayer) {
        var bug = this.getFixTabPanel().getRecord();

        this.setMap(map);
        cmp.setMapCenter(L.latLng(bug.get('latitude'), bug.get('longitude')));
        this.renderOsmElement(bug);
    },

    renderOsmElement: function(bug) {
        var me = this,
            url = './server/webservices/osm/' + bug.get('osm_type') + '/' + bug.get('osm_id');

        Ext.Ajax.request({
            url: url,
            headers: {
                'Content-Type': 'text/xml'
            },
            success: function(response) {
                if(response.responseXML) {
                    me.addFeature(response.responseXML, bug);
                }
            }
        });
    },

    addFeature: function(xml, bug) {
        var icon = Kort.util.Config.getMarkerIcon(bug.get('type')),
            layer;

            layer = new L.OSM.DataLayer(xml, {
            styles: {
                way: {
                    clickable: false,
                    color: '#FF0000',
                    fillColor: '#FF0000'
                },
                node: {
                    clickable: false,
                    icon: icon
                },
                area: {
                    clickable: false,
                    color: '#FF0000',
                    fillColor: '#FF0000'
                }
            }
        });
        layer.addTo(this.getMap());
        this.setZoomToLayerBounds(layer);
    },
    
    setZoomToLayerBounds: function(layer) {
        var bounds;
        
        bounds = layer.getBounds();
        // TODO reading private variables to check if layer has any bounds
        if(bounds.hasOwnProperty('_northEast') || bounds.hasOwnProperty('_southWest')) {
            this.getMap().fitBounds(bounds);
        }
    },

    onFixFormSubmitButtonTap: function() {
        var me = this,
            fixTabPanel = this.getFixTabPanel(),
            fixFieldValue = this.getFixField().getValue(),
            fix;

        if (fixFieldValue !== '') {
            /*Ext.Ajax.request({
                url: './server/webservices/bug/fixes',
                callback: function(options, success, response) {
                    alert('form submitted successfully!');
                },
                scope: me,
                form: 'fixform',
                isUpload: true
            });*/

            fix = Ext.create('Kort.model.Fix', { error_id: fixTabPanel.getRecord().get('id'), message: fixFieldValue });
            fix.save({
                success: function() {
                    me.fixSuccessfulSubmittedHandler();
                },
                failure: function() {
                    var messageBox = Ext.create('Kort.view.NotificationMessageBox');
                    messageBox.alert(Ext.i18n.Bundle.message('fix.alert.submit.failure.title'), Ext.i18n.Bundle.message('fix.alert.submit.failure.message'), Ext.emptyFn);
                }
            });
        } else {
            var messageBox = Ext.create('Kort.view.NotificationMessageBox');
            messageBox.alert(Ext.i18n.Bundle.message('fix.alert.fixfield.empty.title'), Ext.i18n.Bundle.message('fix.alert.fixfield.empty.message'), Ext.emptyFn);
        }
    },

    onFixFieldKeyUp: function(field, e) {
        // submit form if return key was pressed
        if (e.event.keyCode === 13){
            this.onFixFormSubmitButtonTap();
        }
    },

    fixSuccessfulSubmittedHandler: function() {
        this.showProblemAddedPopupPanel();
        // remove detail panel
        this.getBugmapNavigationView().pop();
    },

    /**
	 * Displays the confirmation popup
	 * @private
	 */
	showProblemAddedPopupPanel: function() {
        var popupPanel = Ext.create('Kort.view.bugmap.fix.SubmittedPopupPanel');
		Ext.Viewport.add(popupPanel);
		popupPanel.show();
	}
});