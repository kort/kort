/**
 * Demonstrates a NestedList, which uses a TreeStore to drill down through hierarchical data
 */
Ext.require('Ext.data.TreeStore', function() {
    Ext.define('Kitchensink.view.NestedList', {
        requires: ['Kitchensink.view.EditorPanel', 'Kitchensink.model.Cars', 'Ext.layout.Fit'],
        extend: 'Ext.Container',
        config: {
            layout: 'fit',
            items: [{
                xtype: 'nestedlist',
                store: {
                    type: 'tree',
                    id: 'NestedListStore',
                    model: 'Kitchensink.model.Cars',
                    root: {},
                    proxy: {
                        type: 'ajax',
                        url: 'carregions.json'
                    }
                },
                displayField: 'text',
                listeners: {
                    leafitemtap: function(me, list, index, item) {
                        var editorPanel = Ext.getCmp('editorPanel') || new Kitchensink.view.EditorPanel();
                        editorPanel.setRecord(list.getStore().getAt(index));
                        if (!editorPanel.getParent()) {
                            Ext.Viewport.add(editorPanel);
                        }
                        editorPanel.show();
                    }
                }
            }]
        }
    });
});
