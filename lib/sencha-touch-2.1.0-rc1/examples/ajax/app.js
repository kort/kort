//<debug>
Ext.Loader.setPath({
    'Ext': '../../src'
});
//</debug>

/**
 * This application demonstrates the simple AJAX abilities of Sencha Touch.
 *
 * We setup a simple container which has a 2 buttons which will trigger a function to either make
 * a AJAX request using Ext.Ajax.request or a JSONP request using Ext.data.JsonP.
 */

//the first thing we do is define out application
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

    //requires defines the Components/Classes that our application requires.
    requires: [
        'Ext.Container',
        'Ext.Button',
        'Ext.Toolbar',
        'Ext.TitleBar',
        'Ext.data.JsonP',
        'Ext.Ajax',
        'Ext.XTemplate'
    ],

    /**
     * The launch method is called when the browser is ready, and the application can launch.
     *
     * Within this function we create two a new container which will show the content which
     * is returned when we make an AJAX request. We also have a toolbar docked to the top which
     * has buttons to trigger the AJAX requests. And finally we have a toolbar docked to the bottom
     * which shows the status of the current request.
     */
    launch: function() {
        Ext.Viewport.add({
            //define each of the items inside this container
            layout: 'fit',
            items: [
                {
                    //we give it an id so we can refrence it below
                    id: 'contentView',

                    //the content can be scrolled, so set the scrollable config to true
                    scrollable: true,

                    //we give it a cls so we can custom style it using CSS
                    cls: 'x-content',

                    //we set the default html to something we the user knows what is happening
                    html: 'This example can use either JSONP or AJAX to retrieve data.'

                },
                //this is the top toolbar which will show the two buttons to make a request
                {
                    //we give it an xtype of titlebar. titlebar allows you to use 'align' in
                    //it's children so we can align them to the left/right. see directly below
                    xtype: 'titlebar',

                    //we want the bar to be docked at the top
                    docked: 'top',

                    //and now we define the items we want inside the toolbar
                    items: [
                        {
                            //the text displayed on the button
                            text: 'JSONP',

                            //next we give this button it's handler, which is a link to the function
                            //we want to call when this button is tapped. we also give it a scope so
                            //it knows to call this function within the scope of our application
                            handler: this.makeJSONPRequest,
                            scope: this,

                            //align the button to the left
                            align: 'left'
                        },
                        {
                            //the text of the button
                            text: 'XMLHTTP',

                            //once again we give it a link to the function we want to call when we tap
                            //the button. this time it calls the Ajax method
                            handler: this.makeAjaxRequest,
                            scope: this,

                            //and then align to the right
                            align: 'right'
                        }
                    ]
                },

                //now we define the bottom toolbar.
                {
                    //this time we just use toolbar, as we dont need to align buttons within it
                    xtype: 'toolbar',

                    //give it an id so we can reference it later
                    id: 'statusView',

                    //do it to the bottom
                    docked: 'bottom',

                    //give it it's default title
                    title: 'Tap a button above.',

                    //and we give it a ui of 'light' (the default is dark) so it looks a little difference
                    ui: 'light'
                }
            ]
        });

        //we set application variables so we don't have to keep finding a reference to both the contentView
        //and statusView each time we need to update them (below).
        //we use Ext.getCmp which allows us to find a component from an id (which we specified above)
        this.contentView = Ext.getCmp('contentView');
        this.statusView = Ext.getCmp('statusView');
    },

    /**
     * This makes an AJAX request using Ext.Ajax.request. When it completes, it updates the contentView's
     * html configuration with the responseText (data from the loaded file).
     */
    makeAjaxRequest: function() {
        //firstly we set local variables of the contentView and statusView. we generallt do this
        //only if we are going to use it more than once in our function
        var contentView = this.contentView,
            statusView = this.statusView;

        //next we call the setter of the masked configuration in our contentview. we give it an option
        //which tells it to use a Ext.LoadMask which display a loading indicator, and will also display
        //the provided message
        contentView.setMasked({
            xtype: 'loadmask',
            message: 'Loading...'
        });

        //now we create the Ajax request
        Ext.Ajax.request({
            //first we give it the URL of the request. take not that this can only be local to the web server
            //you are on
            url: 'test.json',

            //then we define a success method, which is called once the ajax request is successful
            success: function(response) {
                //the first argument returned is the reponse object, and that object has a property called
                //responseText which is the text of the file we just loaded. so we call setHtml which
                //will update the contentView with the text of the response
                contentView.setHtml(response.responseText);

                //now we set the title of the statusView component to say we loaded the json file
                statusView.setTitle('Static test.json file loaded');

                //and finally we unmask the contentView so the content is viewable
                contentView.unmask();
            },
            failure: function() {
                contentView.unmask();
            }
        });
    },

    /**
     * This method makes a JSONP request using Ext.data.JsonP. JSONP is used when you need to make cross-domain
     * requests. otherwise you can use AJAX (above).
     *
     * When the request completes, it will display weather information for the specified location in the
     * contentView.
     */
    makeJSONPRequest: function() {
        //once again we set local variables of the contentView and statusView because we need to reference them
        //more than once. we also get the XTemplate instance which we will used to display weather information.
        var tpl = this.getWeatherTemplate(),
            contentView = this.contentView,
            statusView = this.statusView;

        //first we set the mask of the contentView to show a loading message
        contentView.setMasked({
            xtype: 'loadmask',
            message: 'Loading...'
        });

        //next we use Ext.data.JsonP to make a request
        Ext.data.JsonP.request({
            //we give it the url to the free worldweatheronline.com api
            url: 'http://free.worldweatheronline.com/feed/weather.ashx',

            //the callbackKey is used for JSONP requests
            callbackKey: 'callback',

            //now we define the params to be sent to the server
            params: {
                //first it is the API key so we can use the site
                key: '23f6a0ab24185952101705',

                //nexgt is the `q` param which is a valid US zipcode (palo alto in this case)
                q: '94301',

                //next we define the format, json
                format: 'json',

                //and finally the number of days we want
                num_of_days: 5
            },

            //now we define a callback method which is called when the JSONP response is successful.
            success: function(result) {
                //the result is a json object which is returned by the API we just requested.
                //in this case all we want is the data.weather property, which is an array
                var weather = result.data.weather;

                //now we check if the weather is actually defined
                if (weather) {
                    //if it is defined, we use the setHtml method on contentView to update the html
                    //using the tpl.apply method.
                    //Ext.XTemplate.apply will bind the data you pass into the xtemplate provided
                    //and return a string
                    contentView.setHtml(tpl.apply(weather));
                } else {
                    //if it wasn't defined, we throw an error using Ext.Msg.alert()
                    Ext.Msg.alert('Error', 'There was an error retrieving the weather.');
                }

                //now we set the title of the status bar
                statusView.setTitle('Weather: Palo Alto, CA');

                //and finally unmask the content view
                contentView.unmask();
            }
        });
    },

    /**
     * Returns a Ext.XTemplate instance which will be used to display each weather result when makeJSONPRequest
     * is called.
     * @return {Ext.XTemplate} The returned template
     */
    getWeatherTemplate: function() {
        return new Ext.XTemplate([
            '<tpl for=".">',
                '<div class="day">',
                    '<div class="date">{date:date("M d, Y")}</div>',
                    '<div class="icon">',
                        '<tpl for="weatherIconUrl">',
                            '<img src="{value}" />',
                        '</tpl>',
                    '</div>',
                    '<div class="temp">{tempMaxF}&deg;<span class="temp_low">{tempMinF}&deg;</span></div>',
                '</div>',
            '</tpl>'
        ].join(''));
    }
});

