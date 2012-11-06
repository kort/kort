//<debug>
Ext.Loader.setPath({
    'Ext': '../../src'
});
//</debug>

/**
 * Ext.application is the heart of your app. It sets the application name, can specify the icon and startup images to
 * use when your app is added to the home screen, and sets up your application's dependencies - usually the models,
 * views and controllers that your app uses.
 */
Ext.application({
    name: 'Kitchensink',
    //<feature charts>
    requires: ['Kitchensink.view.ColorPatterns'],
    //</feature>
    
    //sets up the icon and startup screens for when the app is added to a phone/tablet home screen
    startupImage: {
        '320x460': 'resources/startup/Default.jpg', // Non-retina iPhone, iPod touch, and all Android devices
        '640x920': 'resources/startup/640x920.png', // Retina iPhone and iPod touch
        '640x1096': 'resources/startup/640x1096.png', // iPhone 5 and iPod touch (fifth generation)
        '768x1004': 'resources/startup/768x1004.png', //  Non-retina iPad (first and second generation) in portrait orientation
        '748x1024': 'resources/startup/748x1024.png', //  Non-retina iPad (first and second generation) in landscape orientation
        '1536x2008': 'resources/startup/1536x2008.png', // : Retina iPad (third generation) in portrait orientation
        '1496x2048': 'resources/startup/1496x2048.png' // : Retina iPad (third generation) in landscape orientation
    },

    isIconPrecomposed: false,
    icon: {
        57: 'resources/icons/icon.png',
        72: 'resources/icons/icon@72.png',
        114: 'resources/icons/icon@2x.png',
        144: 'resources/icons/icon@144.png'
    },

    //loads the views used by the app from the app/view folder
    views: [
        //component demos
        'NestedList', 'List', 'SourceOverlay', 'Buttons',
        'Forms', 'Icons', 'BottomTabs',
        'Map', 'Overlays', 'Tabs', 'Toolbars',
        'Video', 'Audio', 'Carousel', 'TouchEvents',

        //data and utility demos
        'JSONP', 'YQL', 'Ajax', 'NestedLoading',

        //card transition animation demos
        'SlideLeft', 'SlideRight', 'SlideUp', 'SlideDown',
        'CoverLeft', 'CoverRight', 'CoverUp', 'CoverDown',
        'RevealLeft', 'RevealRight', 'RevealUp', 'RevealDown',
        'Pop', 'Fade', 'Flip', 'Cube'
        
        //<feature charts>
        //charts/draw demos
        ,'AreaChart', 'LineChart', 'ColumnChart', 'ColumnChartStacked', 'ColumnChart3D',
        'PieChart', 'FreeDraw', 'ScatterChart', 'PieChart3D', 'CandlestickChart', 'OHLCChart',
        'LineChartWithMarker', 'BarChart', 'RadarChart', 'PlotChart', 'GaugeChart', 'BubbleChart', 
        'VectorIcons'
        //</feature>
    ],

    //loads app/store/Demos.js, which contains the tree data for our main navigation NestedList
    stores: ['Demos', 'USD2EUR', 'OrderItems', 'StockPrice', 'List', 'Pie'],

    //the Kitchen Sink has Phone and Tablet modes, which rearrange the screen based on the type
    //of device detected
    profiles: ['Tablet', 'Phone']
});
