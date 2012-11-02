Ext.define('Kort.controller.Fix', {
    extend: 'Ext.app.Controller',
    
    config: {
        views: [
            'bugmap.fix.TabPanel',
            'bugmap.fix.Map',
            'bugmap.fix.FormContainer'
        ],
        refs: {
            mainTabPanel: '#mainTabPanel',
            bugmapNavigationView: '#bugmapNavigationView',
            fixSubmitButton: '#fixFormSubmitButton',
            messageTextField: 'textfield[name=fixmessage]',
            fixmap: '#fixTabPanel .fixmap'
        },
        control: {
            fixSubmitButton: {
                tap: 'onFixSubmitButtonTap'
            },
            fixmap: {
                maprender: 'onFixmapMaprender'
            }
        },

        before: {
            showBugDetail: 'ensureBugStoreLoad'
        },
        routes: {
            'bug/:id': 'showBugDetail'
        },
        
        bugsStore: null,
        activeBug: null,
        map: null
    },
    
    init: function() {
        this.setBugsStore(Ext.getStore('Bugs'));
    },
    
    ensureBugStoreLoad: function(action) {
        var store = this.getBugsStore();

        if (store.data.all.length) {
            action.resume();
        } else {
            store.load(function() {
                action.resume();
            });
        }
    },
    
    showBugDetail: function(id) {
        var me = this,
            bug = me.getBugsStore().getById(id);
        
        if(me.getMainTabPanel().getActiveItem() !== me.getBugmapNavigationView()) {
            me.getMainTabPanel().on('activeitemchange', function(container, newCmp, oldCmp, eOpts) {
                me.redirectTo('bug/' + id);
            }, me, { delay: 1000, single: true });
            me.getMainTabPanel().setActiveItem(this.getBugmapNavigationView());
        }
        
        if(bug) {
            me.setActiveBug(bug);
            me.getMainTabPanel().setActiveItem(me.getBugmapNavigationView());
            me.getBugmapNavigationView().push(Ext.create('Kort.view.bugmap.fix.TabPanel', {
                bugdata: bug,
                title: bug.get('title')
            }));
        }
    },
    
    onFixmapMaprender: function(cmp, map, tileLayer) {
        this.setMap(map);
        cmp.setMapCenter(L.latLng(this.getActiveBug().get('latitude'), this.getActiveBug().get('longitude')));
        this.renderOsmElement(map);
    },
    
    renderOsmElement: function() {
        var me = this,
            url = './server/webservices/osm/' + this.getActiveBug().get('osm_type') + '/' + this.getActiveBug().get('osm_id');
        
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
    
    onFixSubmitButtonTap: function() {
        var me = this,
            bugDetailPanel = this.getBugmapNavigationView().getActiveItem(),
            fix;
            
        var messageValue = this.getMessageTextField().getValue();
        
        if(messageValue !== '') {
            /*Ext.Ajax.request({
                url: './server/webservices/bug/fixes',
                callback: function(options, success, response) {
                    alert('form submitted successfully!');
                },
                scope: me,
                form: 'fixform',
                isUpload: true
            });*/
            
            fix = Ext.create('Kort.model.Fix', { error_id: bugDetailPanel.getBugdata().get('id'), message: this.getMessageTextField().getValue()});
            fix.save({
                success: function() {
                    // remove detail panel
                    me.getBugmapNavigationView().pop();
                },
                failure: function() {
                    console.log('failure');
                }
            });
        } else {
            console.log('please fill in all form fields');
        }
    }
});