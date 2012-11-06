//<debug>
Ext.Loader.setPath({
    'Ext': '../../src'
});
//</debug>

/**
 * This application demonstrates using the YQL service.
 *
 * It will include 3 items which will return kiva data, weather data, and blog posts from
 * the Sencha Blog.
 */

/**
 * This is a simple wrapper of the Ext.data.JsonP class to help make YQL queries easier.
 */
Ext.YQL = {
    useAllPublicTables: true,
    yqlUrl: 'http://query.yahooapis.com/v1/public/yql',
    request: function(config) {
        //get the params for the request
        var params = config.params || {};
        params.q = config.query;
        params.format = 'json';

        if (this.useAllPublicTables) {
            params.env = 'store://datatables.org/alltableswithkeys';
        }

        Ext.data.JsonP.request({
            url: this.yqlUrl,
            callbackKey: 'callback',
            params: params,
            callback: config.callback,
            scope: config.scope || window
        });
    }
};

//define our application
Ext.application({
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

    // specify the components and classes required for this example
    requires: [
        'Ext.Toolbar',
        'Ext.SegmentedButton',
        'Ext.data.JsonP',
        'Ext.XTemplate'
    ],

    /**
     * This object is used to store data for each of the services we will be getting data from using YQL.
     *
     * Each of the properties have a query, which is the query made to the YQL service, and a tpl, which is the
     * template used when inserting the data into the example.
     */
    demoLookup: {
        //kiva
        kiva: {
            query: 'select * from kiva.loans.recent',
            tpl: Ext.create('Ext.XTemplate', [
                '<div class="kiva">',
                    '<h3>List of loans returned from <strong>Kiva.org</strong>:</h3>',
                    '<tpl if="loans">',
                        '<tpl for="loans">',
                            '{name}<br/>',
                        '</tpl>',
                    '</tpl>',
                '</div>'
            ])
        },
        //weather
        weather: {
            query: 'select * from weather.forecast where location = 94301',
            tpl: Ext.create('Ext.XTemplate', [
                '<div class="weather">',
                    '<h2>{channel.item.condition.temp}&deg; {channel.item.condition.text}</h1>',
                    '<h3>{channel.item.title}</h3>',
                '</div>'
            ])
        },
        //extjs
        blog: {
            query: "select * from rss where url='http://feeds.feedburner.com/extblog' limit 5",
            tpl: Ext.create('Ext.XTemplate', [
                '<tpl if="item">',
                    '<tpl for="item">',
                        '<div class="blog-post">',
                            '<h3><a href="{link}" target="_blank">{title}</a></h3>',
                            '<p>{description}</p>',
                        '</div>',
                    '</tpl>',
                '</tpl>'
            ])
        }
    },

    /**
     * The launch method is called when the browser is ready, and the application can launch.
     *
     * Within this method we will eb creating one container and inserting it into the viewport. This is the container
     * which will contain the data returned by the YQL request. It will also contain a toolbar which will allow users
     * to switch between each of the services.
     */
    launch: function() {
        this.contentView = Ext.Viewport.add({
            //make this container scrollable
            scrollable: true,

            //style html content using css
            styleHtmlContent: true,

            //set the default html content when loading the example
            html: 'YQL is an excellent service from Yahoo! that provides a multitude of JSON APIs for traditionally REST-based services.',

            //specify the toolbar as a docked item
            items: [
                {
                    //toolbar xtype
                    xtype: 'toolbar',

                    //dock it to the top
                    docked: 'top',

                    //give it a UI of light
                    ui: 'light',

                    //give the layout configuration a pack of center so the items of this toolbar will be centered horizontally
                    layout: {
                        pack: 'center'
                    },

                    //specify the items of this toolbar
                    items: [
                        {
                            //insert a segmented button
                            xtype: 'segmentedbutton',

                            //give the segmented button a few items (defaults to Ext.Button's)
                            items: [
                                {
                                    //kiva button
                                    text: 'Kiva',

                                    //give it a handler of the make yql request method and ensure the scope is this application
                                    scope: this,
                                    handler: this.makeYqlRequest
                                },
                                {
                                    //weather button
                                    text: 'Weather',
                                    scope: this,
                                    handler: this.makeYqlRequest
                                },
                                {
                                    //blog button
                                    text: 'Blog',
                                    scope: this,
                                    handler: this.makeYqlRequest
                                }
                            ]
                        }
                    ]
                }
            ]
        });
    },

    /**
     * This method will use the Ext.YQL class above to make a request to the YQL service using a
     * specified configuration.
     * @param {Ext.Button} button the button which is tapped on for this request.
     */
    makeYqlRequest: function(button) {
        var me = this,
            contentView = this.contentView,
            //get the service name using the text of the button
            service = button.getText().toLowerCase(),
            //get the options of the service using the demoLookup configuration
            options = me.demoLookup[service];

        //make the contentview while we request YQL
        contentView.setMasked({
            xtype: 'loadmask',
            message: 'Loading...'
        });

        if (options) {
            //make the YQL request
            Ext.YQL.request({
                //give it the proper queury from the options
                query: options.query,

                //and give it a callback when the response comes back
                callback: function(success, response) {
                    var results = [];

                    //get the results from the quesy
                    if (response.query && response.query.results) {
                        results = response.query.results;
                    }

                    //update html of the contentview using the results returned from YQL
                    contentView.setHtml(options.tpl.apply(results));

                    //unmask the content view
                    contentView.unmask();
                }
            });
        }
    }
});
