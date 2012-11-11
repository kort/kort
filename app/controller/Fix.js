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
            fixTabPanel: '#fixTabPanel',
            fixFormSubmitButton: '#fixFormSubmitButton',
            fixMessageTextField: '#fixTabPanel .textfield[name=fixmessage]',
            fixForm: '#fixTabPanel .fixform',
            fixmap: '#fixTabPanel .fixmap'
        },
        control: {
            fixFormSubmitButton: {
                tap: 'onFixFormSubmitButtonTap'
            },
            fixMessageTextField: {
                keyup: 'onFixMessageTextfieldKeyUp'
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
                    me.addFeature(response.responseXML);
                }
            }
        });
    },

    addFeature: function(xml) {
        var layer,
            bounds;

        layer = new L.OSM.DataLayer(xml, {
            styles: {
                way: {
                    clickable: false,
                    color: '#FF0000',
                    fillColor: '#FF0000'
                },
                node: {
                    clickable: false,
                    color: '#FF0000',
                    fillColor: '#FF0000'
                },
                area: {
                    clickable: false,
                    color: '#FF0000',
                    fillColor: '#FF0000'
                }
            }
        });
        layer.addTo(this.getMap());
        bounds = layer.getBounds();
        // TODO reading private variables to check if layer has any bounds
        if(bounds.hasOwnProperty('_northEast') || bounds.hasOwnProperty('_southWest')) {
            this.getMap().fitBounds(bounds);
        }
    },

    onFixFormSubmitButtonTap: function() {
        var me = this,
            fixTabPanel = this.getFixTabPanel(),
            messageValue = this.getFixMessageTextField().getValue(),
            fix;

        if (messageValue !== '') {
            /*Ext.Ajax.request({
                url: './server/webservices/bug/fixes',
                callback: function(options, success, response) {
                    alert('form submitted successfully!');
                },
                scope: me,
                form: 'fixform',
                isUpload: true
            });*/

            fix = Ext.create('Kort.model.Fix', { error_id: fixTabPanel.getBugdata().get('id'), message: this.getFixMessageTextField().getValue()});
            fix.save({
                success: function() {
                    me.fixSuccessfulSubmittedHandler();
                },
                failure: function() {
                    console.log('failure');
                }
            });
        } else {
            console.log('please fill in all form fields');
        }
    },

    onFixMessageTextfieldKeyUp: function(field, e) {
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