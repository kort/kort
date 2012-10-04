/**
 * Demonstrates loading data over AJAX. See http://docs.sencha.com/touch/2-0/#!/guide/ajax for more
 * background on Sencha Touch 2's AJAX capabilities
 */
Ext.define('Kitchensink.view.Ajax', {
    extend: 'Ext.Container',
    config: {
        scrollable: true,
        items: [
            {
                xtype: 'panel',
                id: 'Ajax',
                styleHtmlContent: true
            },
            {
                docked: 'top',
                xtype: 'toolbar',
                items: [
                    {
                        text: 'Load using Ajax',
                        handler: function() {
                            var panel = Ext.getCmp('Ajax');

                            panel.getParent().setMasked({
                                xtype: 'loadmask',
                                message: 'Loading...'
                            });

                            Ext.Ajax.request({
                                url: 'test.json',
                                success: function(response) {
                                    panel.setHtml(response.responseText);
                                    panel.getParent().unmask();
                                }
                            });
                        }
                    }
                ]
            }
        ]
    }
});
