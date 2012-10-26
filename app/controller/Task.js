Ext.define('Kort.controller.Task', {
    extend: 'Ext.app.Controller',
    
    config: {
        views: [
            'task.TabPanel',
            'task.FormContainer'
        ],
        refs: {
            bugmapNavigationView: '#bugmapNavigationView',
            fixSubmitButton: '#fixSubmitButton',
            messageTextField: 'textfield[name=message]'
        },
        control: {
            fixSubmitButton: {
                tap: 'onFixSubmitButtonTap'
            }
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
    
    showBugDetail: function(id) {
        var bug = this.getBugsStore().getById(id);
        
        if(bug) {
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