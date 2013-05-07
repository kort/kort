/**
 * Controller for about tab.
 */
Ext.define('Kort.controller.About', {
    extend: 'Ext.app.Controller',
    
    config: {
        views: [
            'about.Container'
        ],
        refs: {
            aboutContainer: '#aboutContainer'
        }
    }
});