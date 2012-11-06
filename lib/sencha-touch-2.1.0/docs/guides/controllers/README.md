# Controllers

Controllers are responsible for responding to events that occur within your app. If your app contains a Logout {@link Ext.Button button} that your user can tap on, a Controller would listen to the Button's tap event and take the appropriate action. It allows the View classes to handle the display of data and the Model classes to handle theloading and saving of data - the Controller is the glue that binds them together.

## Relation to Ext.app.Application

Controllers exist within the context of an {@link Ext.app.Application Application}. An Application usually consists of a number of Controllers, each of which handle a specific part of the app. For example, an Application that handles the orders for an online shopping site might have controllers for Orders, Customers and Products.

All of the Controllers that an Application uses are specified in the Application's {@link Ext.app.Application#controllers} config. The Application automatically instantiates each Controller and keepsreferences to each, so it is unusual to need to instantiate Controllers directly. By convention each Controller is named after the thing (usually the Model) that it deals with primarily, usually in the plural - for example if your app is called 'MyApp' and you have a Controller that manages Products, convention is to create a MyApp.controller.Products class in the file app/controller/Products.js.

## Launching

There are 4 main phases in your Application's launch process, 2 of which are inside Controller. Firstly, each Controller is able to define an {@link Ext.app.Controller#init init} function, which is called before the Application launch function. Secondly, after the Application and Profile launch functions have been called, the Controller's launch function is called as the last phase of the process:

1. Controller#init functions called
2. Profile#launch function called
3. Application#launch function called
4. Controller#launch functions called

Most of the time your Controller-specific launch logic should go into your Controller's launch function. Because this is called after the Application and Profile launch functions, your app's initial UI is expected to be in place by this point. If you need to do some Controller-specific processing before app launch you can implement a Controller init function.

## Refs and Control

The centerpiece of Controllers is the twin configurations {@link Ext.app.Controller#refs refs} and {@link Ext.app.Controller#cfg-control control}. These are used to easily gain references to Components inside your app and to take action on them based on events that they fire. Let's look at {@link Ext.app.Controller#refs refs} first:

### Refs

Refs leverage the powerful {@link Ext.ComponentQuery ComponentQuery} syntax to easily locate Components on your page. We can define as many refs as we like for each Controller, for example here we define a ref called 'nav' that finds a Component on the page with the ID 'mainNav'. We then use that ref in the addLogoutButton beneath it:

    Ext.define('MyApp.controller.Main', {
        extend: 'Ext.app.Controller',

        config: {
            refs: {
                nav: '#mainNav'
            }
        },

        addLogoutButton: function() {
            this.getNav().add({
                text: 'Logout'
            });
        }
    });

Usually, a ref is just a key/value pair - the key ('nav' in this case) is the name of the reference that will be generated, the value ('#mainNav' in this case) is the {@link Ext.ComponentQuery ComponentQuery} selector that will be used to find the Component.

Underneath that, we have created a simple function called addLogoutButton which uses this ref via its generated 'getNav' function. These getter functions are generated based on the refs you define and always follow the same format - 'get' followed by the capitalized ref name. In this case we're treating the nav reference as though it's a {@link Ext.Toolbar Toolbar}, and adding a Logout button to it when our function is called. This ref would recognize a Toolbar like this:

    Ext.create('Ext.Toolbar', {
        id: 'mainNav',

        items: [
            {
                text: 'Some Button'
            }
        ]
    });

Assuming this Toolbar has already been created by the time we run our 'addLogoutButton' function (we'll see how that is invoked later), it will get the second button added to it.

### Advanced Refs

Refs can also be passed a couple of additional options, beyond name and selector. These are autoCreate and xtype, which are almost always used together:

    Ext.define('MyApp.controller.Main', {
        extend: 'Ext.app.Controller',

        config: {
            refs: {
                nav: '#mainNav',

                infoPanel: {
                    selector: 'tabpanel panel[name=fish] infopanel',
                    xtype: 'infopanel',
                    autoCreate: true
                }
            }
        }
    });

We've added a second ref to our Controller. Again the name is the key, 'infoPanel' in this case, but this time we've passed an object as the value instead. This time we've used a slightly more complex selector query - in this example imagine that your app contains a {@link Ext.tab.Panel tab panel} and that one of the items in the tab panel has been given the name 'fish'. Our selector matches any Component with the xtype 'infopanel' inside that tab panel item.

The difference here is that if that infopanel does not exist already inside the 'fish' panel, it will be automatically created when you call this.getInfoPanel inside your Controller. The Controller is able to do this because we provided the xtype to instantiate with in the event that the selector did not return anything.

### Control

The sister config to {@link Ext.app.Controller#refs refs} is {@link Ext.app.Controller#cfg-control control}. {@link Ext.app.Controller#cfg-control Control} is the means by which your listen to events fired by Components and have your Controller react in some way. Control accepts both ComponentQuery selectors and refs as its keys, and listener objects as values - for example:

    Ext.define('MyApp.controller.Main', {
        extend: 'Ext.app.Controller',

        config: {
            control: {
                loginButton: {
                    tap: 'doLogin'
                },
                'button[action=logout]': {
                    tap: 'doLogout'
                }
            },

            refs: {
                loginButton: 'button[action=login]'
            }
        },

        doLogin: function() {
            // called whenever the Login button is tapped
        },

        doLogout: function() {
            // called whenever any Button with action=logout is tapped
        }
    });

Here we have set up two control declarations - one for our loginButton ref and the other for any Button on the page that has been given the action 'logout'. For each declaration we passed in a single event handler - in each case listening for the 'tap' event, specifying the action that should be called when that Button fires the tap event. Note that we specified the 'doLogin' and 'doLogout' methods as strings inside the control block - this is important.

You can listen to as many events as you like in each control declaration, and mix and match ComponentQuery selectors and refs as the keys.

## Routes

As of Sencha Touch 2, Controllers can now directly specify which routes they are interested in. This enables us to provide history support within our app, as well as the ability to deeply link to any part of the application that we provide a route for.

For example, let's say we have a Controller responsible for logging in and viewing user profiles, and want to make those screens accessible via urls. We could achieve that like this:

    Ext.define('MyApp.controller.Users', {
        extend: 'Ext.app.Controller',

        config: {
            routes: {
                'login': 'showLogin',
                'user/:id': 'showUserById'
            },

            refs: {
                main: '#mainTabPanel'
            }
        },

        // uses our 'main' ref above to add a loginpanel to our main TabPanel (note that
        // 'loginpanel' is a custom xtype created for this application)
        showLogin: function() {
            this.getMain().add({
                xtype: 'loginpanel'
            });
        },

        // Loads the User then adds a 'userprofile' view to the main TabPanel
        showUserById: function(id) {
            MyApp.model.User.load(id, {
                scope: this,
                success: function(user) {
                    this.getMain().add({
                        xtype: 'userprofile',
                        user: user
                    });
                }
            });
        }
    });

The routes we specified above simply map the contents of the browser address bar to a Controller function to call when that route is matched. The routes can be simple text like the login route, which matches against http://myapp.com/#login, or contain wildcards like the 'user/:id' route, which matches urls like http://myapp.com/#user/123. Whenever the address changes the Controller automatically calls the function specified.

Note that in the showUserById function we had to first load the User instance. Whenever you use a route, the function that is called by that route is completely responsible for loading its data and restoring state. This is because your user could either send that url to another person or simply refresh the page, which we wipe clear any cached data you had already loaded. There is a more thorough discussion of restoring state with routes in the application architecture guides.

## Before Filters

The final thing that Controllers provide within the context of Routing is the ability to define filter functions that are run before the function specified in the route. These are an excellent place to authenticate or authorize users for specific actions, or to load classes that are not yet on the page. For example, let's say we want to authenticate a user before allowing them to edit a Product in an e-commerce backend:

    Ext.define('MyApp.controller.Products', {
        config: {
            before: {
                editProduct: 'authenticate'
            },

            routes: {
                'product/edit/:id': 'editProduct'
            }
        },

        // this is not directly because our before filter is called first
        editProduct: function() {
            //... performs the product editing logic
        },

        // this is run before editProduct
        authenticate: function(action) {
            MyApp.authenticate({
                success: function() {
                    action.resume();
                },
                failure: function() {
                    Ext.Msg.alert('Not Logged In', "You can't do that, you're not logged in");
                }
            });
        }
    });

Whenever the user navigates to a url like http://myapp.com/#product/edit/123 the Controller's authenticate function will be called and passed the Ext.app.Action that would have been executed if the before filter did not exist. An Action simply represents the Controller, function (editProduct in this case) and other data like the ID parsed from the url.

The filter can now perform any kind of processing it needs to, either synchronously or asynchronously. In this case we're using our application's *authenticate* function to check that the user is currently logged in. This could entail an AJAX request to check the user's credentials on the server so it runs asynchronously - if the authentication was successful we continue the action by calling *action.resume()*, if not we tell the user that they need to log in first.

Before filters can also be used to load additional classes before certain actions are performed. For example, if some actions are rarely used you may wish to defer loading of their source code until they are needed so that the application boots up faster. To achieve this you can simply set up a filter that uses Ext.Loader to load code on demand.

Any number of before filters can be specified for each action, to use more than one filter just pass in an array:

    Ext.define('MyApp.controller.Products', {
        config: {
            before: {
                editProduct: ['authenticate', 'ensureLoaded']
            },

            routes: {
                'product/edit/:id': 'editProduct'
            }
        },

        // this is not directly because our before filter is called first
        editProduct: function() {
            //... performs the product editing logic
        },

        // this is the first filter that is called
        authenticate: function(action) {
            MyApp.authenticate({
                success: function() {
                    action.resume();
                },
                failure: function() {
                    Ext.Msg.alert('Not Logged In', "You can't do that, you're not logged in");
                }
            });
        },

        // this is the second filter that is called
        ensureLoaded: function(action) {
            Ext.require(['MyApp.custom.Class', 'MyApp.another.Class'], function() {
                action.resume();
            });
        }
    });

The filters are called in order, and must each call {@link Ext.app.Action#resume action.resume()} to continue the processing.

## Profile-specific Controllers

Superclass, shared stuff:

	Ext.define('MyApp.controller.Users', {
		extend: 'Ext.app.Controller',

		config: {
			routes: {
				'login': 'showLogin'
			},

			refs: {
				loginPanel: {
					selector: 'loginpanel',
					xtype: 'loginpanel',
					autoCreate: true
				}
			},

			control: {
				'logoutbutton': {
					tap: 'logout'
				}
			}
		},

		logout: function() {
			// code to close the user's session
		}
	});

Phone Controller:

	Ext.define('MyApp.controller.phone.Users', {
		extend: 'MypApp.controller.Users',

		config: {
			refs: {
				nav: '#mainNav'
			}
		},

		showLogin: function() {
			this.getNav().setActiveItem(this.getLoginPanel());
		}
	});

Tablet Controller:

	Ext.define('MyApp.controller.tablet.Users', {
		extend: 'MyApp.controller.Users',

		showLogin: function() {
			this.getLoginPanel().show();
		}
	});
