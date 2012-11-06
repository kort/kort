# Using Device Profiles

Today's mobile web applications are expected to work on a wide variety of devices, spanning from the smallest mobile phones to the largest tablets. These devices have a wide range of screen resolutions and are used in different ways. People tend to use phone apps while out of the house to rapidly gather some information or perform some action - often in under a minute. Tablet apps are more likely to be used for longer periods of time, usually within the home or somewhere else they can sit for a long time.

All of this means that people expect different app experiences on different devices. However, much of your application logic and assets can be shared between these different experiences. Writing separate apps for each platform is time consuming, error-prone and just plain boring. Thankfully, Device Profiles give us a simple way to share just as much code as we need to between device types while making it easy to customize behavior, appearance and workflows for each device.

## Setting up Profiles

Device Profiles exist within the context of an {@link Ext.app.Application Application}, for example if we want to create an email app with phone and tablet profiles we can define our app.js like this (see the [Intro to Apps guide](#!/guide/apps_intro) if this is not familiar):

    Ext.application({
        name: 'Mail',

        profiles: ['Phone', 'Tablet']
    });

We didn't give our Application a {@link Ext.app.Application#launch launch function}, so at the moment all it is going to do is load those two Profiles. By convention, it expects to find these in *app/profile/Phone.js* and *app/profile/Tablet.js*. Here's what our Phone profile might look like:

    Ext.define('Mail.profile.Phone', {
        extend: 'Ext.app.Profile',

        config: {
            name: 'Phone',
            views: ['Main']
        },

        isActive: function() {
            return Ext.os.is.Phone;
        }
    });

The Tablet profile follows the same pattern. In our Phone profile we only really supplied three pieces of information - the Profile {@link Ext.app.Profile#name name}, the optional set of additional {@link Ext.app.Profile#views views} to load if this Profile is activated, and an {@link Ext.app.Profile#isActive isActive} function.

The {@link Ext.app.Profile#isActive isActive} function is what determines if a given profile should be active on the device your app happens to be booting up on. By far the most common split is to create profiles for Phone and Tablet, using the built-in `Ext.os.is.Phone` and `Ext.os.is.Tablet` properties. You can write any code you like in the `isActive` function so long as it always returns `true` or `false` for the device it is running on.

## Determining the Active Profile

Once the Profiles have been loaded, their isActive functions are called in turn. The first one to return true is the Profile that the Application will boot with. This Profile is then set to the Application's {@link Ext.app.Application#currentProfile currentProfile}, and the Application prepares to load all of its dependencies - the models, views, controllers and other classes that constitute the app. It does this by combining its own dependencies with those specified in the active profile.

For example, let's amend our Application so that it loads a few Models and Views of its own:

    Ext.application({
        name: 'Mail',

        profiles: ['Phone', 'Tablet'],

        models: ['User'],
        views: ['Navigation', 'Login']
    });

Now when we load the app on a phone, the Phone profile is activated and the application will load the following files:

* app/model/User.js
* app/view/Navigation.js
* app/view/Login.js
* app/view/**phone**/Main.js

The first three items are specified in the Application itself - the User model plus the Navigation and Login views. The fourth item is specified by the Phone Profile and follows a special form. By convention, classes that are specific to a Profile are expected to be defined in a subdirectory with the same name as the Profile. For example, the 'Main' view specified in the Phone Profile will be loaded from *app/view/**phone**/Main.js*, whereas if we had defined 'Main' in the Application it would be loaded from *app/view/Main.js*.

The same applies to all of the models, views, controllers and stores loaded in a Profile. This is important as it enables us to easily share behavior, view logic and more between profiles (see the specializing views and controllers sections below). If you need to load classes that don't fit with this convention, you can specify the full class name instead:

    Ext.define('Mail.profile.Phone', {
        extend: 'Ext.app.Profile',

        config: {
            name: 'Phone',
            views: ['Main', 'Mail.view.SpecialView'],
            models: ['Mail.model.Message']
        },

        isActive: function() {
            return Ext.os.is.Phone;
        }
    });

As we see above, you can mix and match fully-qualified class names (e.g. *'Mail.view.SomeView'*) and relatively specified class names (e.g. *'Main'*, which becomes *'Mail.view.phone.Main'*). Be aware that all models, views, controllers and stores specified for a Profile are treated this way. This means if there are Models or Stores that you want to load for Tablets only but do not want to make classes like *Mail.model.tablet.User*, you should specify the fully-qualified class names instead (e.g. *Mail.model.User* in this case).

## The Launch Process

The launch process using Profiles is almost exactly the same as it is without Profiles. Profile-based apps have a 3-stage launch process; after all of the dependencies have been loaded, the following happens:

1. Controllers are instantiated; each Controller's {@link Ext.app.Controller#init init} function is called
2. The Profile's {@link Ext.app.Profile#launch launch} function is called
3. The Application's {@link Ext.app.Application#launch launch} function is called.

When using Profiles it's common to use the Profile launch functions to create the app's initial UI. In many cases this means the Application's launch function is completely removed as the initial UI is usually different in each Profile (you can still specify an Application-wide launch function for setting up things like analytics or other profile-agnostic setup).

A typical Profile launch function might look like this:

    Ext.define('Mail.profile.Phone', {
        extend: 'Ext.app.Profile',

        config: {
            name: 'Phone',
            views: ['Main']
        },

        isActive: function() {
            return Ext.os.is.Phone;
        },

        launch: function() {
            Ext.create('Mail.view.phone.Main');
        }
    });

Note that both Profile and Application launch functions are optional - if you don't define them they won't be called.

## Specializing Views

Most of the specialization in a Profile occurs in the views and the controllers. Let's look at the views first. Say we have a Tablet Profile that looks like this:

    Ext.define('Mail.profile.Tablet', {
		extend: 'Ext.app.Profile',

		config: {
			views: ['Main']
		},

		launch: function() {
		    Ext.create('Mail.view.tablet.Main');
		}
	});

When we boot this app up on a tablet device, the file *app/views/tablet/Main.js* will be loaded as usual. Here's what we have in our *app/views/tablet/Main.js* file:

	Ext.define('Mail.view.tablet.Main', {
		extend: 'Mail.view.Main',

		config: {
			title: 'Tablet-specific version'
		}
	});

Usually when we define a view class we extend one of Sencha Touch's built in views but in this case we're extending Mail.view.Main - one of our own views. Here's how that on looks:

    Ext.define('Mail.view.Main', {
        extend: 'Ext.Panel',

        config: {
            title: 'Generic version',
            html: 'This is the main screen'
        }
    });

So we have a superclass (Mail.view.Main) and a Profile-specific subclass (Mail.view.tablet.Main) which can customize any aspect of the superclass. In this case we're changing the title of the Main view from "Generic version" to "Tablet-specific version" in our subclass, so when our app launches that's what we will see.

Because these are just normal classes it's easy to customize almost any part of the superclass using the flexible config system. For example, let's say we also have a phone version of the app - we could customize its version of the Main view like this (*app/view/phone/Main.js*):

    Ext.define('Mail.view.phone.Main', {
		extend: 'Mail.view.Main',

		config: {
			title: 'Phone-specific version',

			items: [
			    {
			        xtype: 'button',
			        text: 'This is a phone...'
			    }
			]
		}
	});

### Sharing sub views

While the above is useful, it's more common to share certain pieces of views and stitch them together in different ways for different profiles. For example, imagine an email app where the tablet UI is a split screen with a message list on the left and the current message loaded on the right. The Phone version is the exact same message list and a similar message view, but this time in a {@link Ext.layout.Card card layout} as there is not enough screen space to see them both simultaneously.

To achieve this we'd start off creating the two shared sub views - the message list and the message viewer. In each case we've left the class config out for brevity:

    Ext.define('Mail.view.MessageList', {
        extend: 'Ext.List',
        xtype: 'messagelist'

        // config goes here...
    });

And the Message Viewer:

    Ext.define('Mail.view.MessageViewer', {
        extend: 'Ext.Panel',
        xtype: 'messageviewer'

        // config goes here...
    });

Now, to achieve our target layout the tablet Main view might do something like this:

    Ext.define('Mail.view.tablet.Main', {
        extend: 'Ext.Container',

        config: {
            layout: 'fit',
            items: [
                {
                    xtype: 'messagelist',
                    width: 200,
                    docked: 'left'
                },
                {
                    xtype: 'messageviewer'
                }
            ]
        }
    });

This will create a 200px wide messagelist on the left, and use the rest of the device's screen space to show the message viewer. Now let's say we want to achieve our Phone layout:

    Ext.define('Mail.view.phone.Main', {
        extend: 'Ext.Container',

        config: {
            layout: 'card',
            items: [
                {
                    xtype: 'messagelist'
                },
                {
                    xtype: 'messageviewer'
                }
            ]
        }
    });

In this case we're just using a Container with a {@link Ext.layout.Card card layout} (a layout that only shows one item at a time), and putting both the list and the viewer into it. We'd need to plug in some logic that tells the Container to show the messageviewer when a message in the list is tapped on, but we've very easily reused our two sub views in different configurations based on which Profile is loaded.

As before, we also have the option to customize the two shared views for each Profile - for example we could create *Mail.view.phone.MessageViewer* and *Mail.view.tablet.MessageViewer* subclasses, both of which extend the *Mail.view.MessageViewer* superclass. This enables us to again share a lot of view code between those classes while presenting customizations appropriate for the device the user happens to be using.

## Specializing Controllers

Just like with Views, many applications have a lot of Controller logic that can be shared across multiple Profiles. The biggest differences here between profiles are usually workflow-related. For example, an app's tablet profile may allow you to complete a workflow on a single page whereas the phone profile presents a multi-page wizard.

Here we have a simple Phone profile that loads a view called *Main* and a controller called *Messages*. As before, this will load *app/view/phone/Main.js* and *app/controller/phone/Messages.js*:

    Ext.define('Mail.profile.Phone', {
		extend: 'Ext.app.Profile',

		config: {
			views: ['Main'],
			controllers: ['Messages']
		},

		launch: function() {
		    Ext.create('Mail.view.phone.Main');
		}
	});

Now, we know that our phone and tablet-specific controllers share most of their functionality so we'll start by creating a controller superclass in *app/controller/Messages.js*:

    Ext.define('Mail.controller.Messages', {
        extend: 'Ext.app.Controller',

        config: {
            refs: {
                viewer: 'messageviewer',
                messageList: 'messagelist'
            },
            control: {
                messageList: {
                    itemtap: 'loadMessage'
                }
            }
        },

        loadMessage: function(item) {
            this.getViewer().load(item);
        }
    });

This Controller does three things:

1. Sets up {@link Ext.app.Controller#refs refs} to views that we care about.
2. Listens for the `itemtap` event on the message list and calls the `loadMessage()` function when `itemtap` is fired.
3. Loads the selected message item into the Viewer when `loadMessage()` is called

Now that we have this, it's easy to create our phone-specific controller:

    Ext.define('Mail.controller.phone.Messages', {
        extend: 'Mail.controller.Messages',

        config: {
            refs: {
                main: '#mainPanel'
            }
        },

        loadMessage: function(item) {
            this.callParent(arguments);
            this.getMain().setActiveItem(1);
        }
    });

Here we're extending the Messages superclass controller and providing two pieces of functionality:

1. We add another ref for the phone UI's main panel
2. We extend the `loadMessage` function to perform the original logic and then set the main panel's active item to the message viewer.

All of the configuration that was in the superclass is inherited by the subclass. In the case of duplicated configs like {@link Ext.app.Controller#refs refs}, the config is merged, so the phone Messages controller class has 3 refs - main, viewer and messageList. Just as with any other class that extends another, we can use `callParent` to extend an existing function in the superclass.

Bear in mind that our *Mail.controller.Messages* superclass is not declared as a dependency by either the Application or the Profile. It it automatically loaded because our *Mail.controller.phone.Messages* controller extends it.

### What to Share

In the example above we were able to share some (but not all) of our {@link Ext.app.Controller#refs refs}. We were also able to share the single event that we listen for with the Controller's {@link Ext.app.Controller#cfg-control control} config. Generally speaking, the more the app diverges between profiles, the fewer refs and control configs you will be able to share.

The one Controller config that should be shared across profiles is {@link Ext.app.Controller#routes routes}. These map urls to controller actions and allow for back button support and deep linking. It's important to keep the routes in the superclass because the same url should map to the same content regardless of the device.

For example, if your friend is using the phone version of your app and sends you a link to the page she is currently on within your app, you should be able to tap that link on your tablet device and see the tablet-specific view for that url. Keeping all routes in the superclass enables you to keep a consistent url structure that will work regardless of device.

## Specializing Models

Models are customized per Profile less frequently than Controllers and Views, so don't usually require a subclass. In this case we just specify the fully qualified class names for models:

	Ext.define('Mail.profile.Tablet', {
		extend: 'Ext.app.Profile',

		config: {
			models: ['Mail.model.Group']
		}
	});
