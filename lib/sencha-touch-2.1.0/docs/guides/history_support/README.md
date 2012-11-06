# Routing, Deep Linking and the Back Button

Sencha Touch 2 comes with fully history and deep-linking support. This gives your web applications two massive benefits:

* The back button works inside your apps, navigating correctly and quickly between screens without refreshing the page
* Deep-linking enables your users to send a link to any part of the app and have it load the right screen

The result is an application that feels much more in tune with what users expect from native apps, especially on Android devices with the built-in back button fully supported.

## Setting up routes

Setting up history support for your apps is pretty straightforward and is centered around the concept of routes. Routes are a simple mapping between urls and controller actions - whenever a certain type of url is detected in the address bar the corresponding Controller action is called automatically. Let's take a look at a simple Controller:

    Ext.define('MyApp.controller.Products', {
        extend: 'Ext.app.Controller',

        config: {
            routes: {
                'products/:id': 'showProduct'
            }
        },

        showProduct: function(id) {
            console.log('showing product ' + id);
        }
    });

By specifying the {@link Ext.app.Controller#routes routes} above, the Main controller will be notified whenever the browser url looks like "#products/123". For example, if your application is deployed onto http://myapp.com, any url that looks like http://myapp.com/#products/123, http://myapp.com/#products/456 or http://myapp.com/#products/abc will automatically cause your showProduct function to be called.

When the showProduct function is called this way, it is passed the 'id' token that was parsed out of the url. This happens because we used ':id' in the route - whenever a route contains a ':' it will attempt to pull that information out of the url and pass it into your function. Note that these parsed tokens are always strings (because urls are always strings themselves), so hitting a route like 'http://myapp.com/#products/456' is the same as calling `showProduct('456')`.

You can specify any number of routes and your routes can each have any number of tokens - for example:

    Ext.define('MyApp.controller.Products', {
        extend: 'Ext.app.Controller',

        config: {
            routes: {
                'products/:id': 'showProduct',
                'products/:id/:format': 'showProductInFormat'
            }
        },

        showProduct: function(id) {
            console.log('showing product ' + id);
        },

        showProductInFormat: function(id, format) {
            console.log('showing product ' + id + ' in ' + format + ' format');
        }
    });

The second route accepts urls like #products/123/pdf, which will route through to the showProductInFormat function and console log 'showing product 123 in pdf format'. Notice that the arguments are passed into the function in the order they appear in the route definition.

Of course, your Controller function probably won't actually just log a message to the console, it can do anything needed by your app - whether it's fetching data, updating the UI or anything else.

## Advanced Routes

By default, wildcards in routes match any sequence of letters and numbers. This means that a route for "products/:id/edit" would match the url "#products/123/edit" but not "#products/a ,fd.sd/edit" - the second contains a number of letters that don't qualify (space, comma, dot).

Sometimes though we want the route to be able to match urls like this, for example if a url contains a file name we may want to be able to pull that out into a single token. To achieve this we can pass a configuration object into our {@link Ext.app.Route Route}:

    Ext.define('MyApp.controller.Products', {
        extend: 'Ext.app.Controller',

        config: {
            routes: {
                'file/:filename': {
                    action: 'showFile',
                    conditions: {
                        ':filename': "[0-9a-zA-Z\.]+"
                    }
                }
            }
        },

        //opens a new window to show the file
        showFile: function(filename) {
            window.open(filename);
        }
    });

So instead of an action string we now have a configuration object that contains an 'action' property. In addition, we added a {@link Ext.app.Route#conditions conditions} configuration which tells the :filename token to match any sequence of numbers and letters, along with a period ('.'). This means our route will now match urls like http://myapp.com/#file/someFile.jpg, passing 'someFile.jpg' in as the argument to the Controller's `showFile` function.

## Restoring State

One challenge that comes with supporting history and deep linking is that you need to be able to restore the full UI state of the app to make it as if the user navigated to the deep-linked page him or herself. This can sometimes be tricky but is the price we pay for making life better for the user.

Let's take the simple example of loading a product based on a url like http://myapp.com/#products/123. Let's update our Products Controller from above:

    Ext.define('MyApp.controller.Products', {
        extend: 'Ext.app.Controller',

        config: {
            refs: {
                main: '#mainView'
            },

            routes: {
                'products/:id': 'showProduct'
            }
        },

        /**
         * Endpoint for 'products/:id' routes. Adds a product details view (xtype = productview)
         * into the main view of the app then loads the Product into the view
         *
         */
        showProduct: function(id) {
            var view = this.getMain().add({
                xtype: 'productview'
            });

            MyApp.model.Product.load(id, {
                success: function(product) {
                    view.setRecord(product);
                },
                failure: function() {
                    Ext.Msg.alert('Could not load Product ' + id);
                }
            });
        }
    });

Here our 'products/:id' url endpoint results in the immediate addition of a view into our app's main view (which could be a TabPanel or other Container), then uses our product model (MyApp.model.Product) to fetch the Product from the server. We added a callback that then populates the product detail view with the freshly loaded Product. We render the UI immediately (as opposed to only rendering it when the Product has been loaded) so that we give the user visual feedback as soon as possible.

Each app will need different logic when it comes to restoring state for a deeply-linked view. For example, the Kitchen Sink needs to restore the state of its NestedList navigation as well as rendering the correct view for the given url. To see how this is accomplished in both Phone and Tablet profiles check out the showView functions in the Kitchen Sink's app/controller/phone/Main.js and app/controller/tablet/Main.js files.

## Sharing urls across Device Profiles

In most cases you'll want to share the exact same route structure between your [Device Profiles](#!/guide/profiles). This way a user using your Phone version can send their current url to a friend using a Tablet and expect that their friend will be taken to the right place in the Tablet app. This generally means it's best to define your route configurations in the superclass of the Phone and Tablet-specific Controllers:

    Ext.define('MyApp.controller.Products', {
        extend: 'Ext.app.Controller',

        config: {
            routes: {
                'products/:id': 'showProduct'
            }
        }
    });

Now in your Phone-specific subclass you can just implement the `showProduct` function to give a Phone-specific view for the given product:

    Ext.define('MyApp.controller.phone.Products', {
        extend: 'MyApp.controller.Products',

        showProduct: function(id) {
            console.log('showing a phone-specific Product page for ' + id);
        }
    });

And in your Tablet-specific subclass just do the same thing, this time showing a tablet-specific view:

    Ext.define('MyApp.controller.tablet.Products', {
        extend: 'MyApp.controller.Products',

        showProduct: function(id) {
            console.log('showing a tablet-specific Product page for ' + id);
        }
    });

There are some exceptions to this rule, usually to do with linking to navigation states. The Kitchen Sink example has phone and tablet specific views - on both profiles we use a NestedList for navigation but whereas on the Tablet NestedList only takes up the left hand edge of the screen, one the Phone it fills the screen. In order to make the back button work as expected on phones, each time we navigate in the NestedList we push the new url into the history, which means that the Phone-specific controller has one additional route. Check out the app/controller/phone/Main.js file for an example of this.
