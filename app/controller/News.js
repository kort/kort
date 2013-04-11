/**
 * Controller for news tab
 */
Ext.define('Kort.controller.News', {
    extend: 'Ext.app.Controller',

    config: {
        views: [
            'news.Container'
        ],
        refs: {
            newsContainer: '#newsContainer'
        }
    }
});
