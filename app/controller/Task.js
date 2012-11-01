Ext.define('Kort.controller.Task', {
    extend: 'Ext.app.Controller',
    
    config: {
        views: [
            'task.TabPanel',
            'task.FormContainer'
        ],
        refs: {
            mainTabPanel: '#mainTabPanel',
            bugmapNavigationView: '#bugmapNavigationView',
            fixSubmitButton: '#fixSubmitButton',
            messageTextField: 'textfield[name=message]',
            taskform: '#taskform'
        },
        control: {
            fixSubmitButton: {
                tap: 'onFixSubmitButtonTap'
            }
        },

        before: {
            showBugDetail: 'ensureBugStoreLoad'
        },
        routes: {
            'bug/:id': {
                action: 'showBugDetail'
            }
        },
        
        bugsStore: null
    },
    
    init: function() {
        this.setBugsStore(Ext.getStore('Bugs'));
    },
    
    ensureBugStoreLoad: function(action) {
        var store = Ext.getStore('Bugs');

        if (store.data.all.length) {
            action.resume();
        } else {
            store.on('load', function() {
                action.resume();
            }, this, {
                single: true
            });
        }
    },
    
    showBugDetail: function(id) {
        var bug = this.getBugsStore().getById(id);
        
        if(bug) {
            this.getMainTabPanel().setActiveItem(this.getBugmapNavigationView());
            this.getBugmapNavigationView().push(Ext.create('Kort.view.task.TabPanel', {
                bugdata: bug,
                title: bug.get('title')
            }));
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
                form: 'taskform',
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