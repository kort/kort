/*
 *  -ChartMe Example-
 *	This is the skeleton app to show case charts. Components can be dragged and dropped around.
 *  Taphold to select a component is also implemented, comment line 58 in ChartContainer.js to enable
 *
 *
 */

Ext.Loader.setConfig({
    enabled: true
});

Ext.application({
    views: [
        'MainView',
        'ChartContainer'
    ],
    name: 'ChartMe',

    launch: function() {

        Ext.create('ChartMe.view.MainView', {fullscreen: true});
    }

});
