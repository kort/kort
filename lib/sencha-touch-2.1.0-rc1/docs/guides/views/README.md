# Using Views in your Applications

From the user's point of view, your application is just a collection of views. Although much of the value of the app is in the Models and Controllers, the Views are what the user interacts with directly. In this guide we're going to look at how to create the views that build your application.

## Using Existing Components

The easiest way to create a view is to just use Ext.create with an existing Component. For example, if we wanted to create a simple Panel with some HTML inside we can just do this:

    @example
    Ext.create('Ext.Panel', {
        html: 'Welcome to my app',
        fullscreen: true
    });

This simply creates a Panel with some html and makes it fill the screen. You can create any of our built-in components this way but best practice is to create a subclass with your specializations and then create that. Thankfully that's simple too:

    @example
    Ext.define('MyApp.view.Welcome', {
        extend: 'Ext.Panel',
        
        config: {
            html: 'Welcome to my app',
            fullscreen: true
        }
    });
    
    Ext.create('MyApp.view.Welcome');

The outcome is the same, but now we have a brand new component that we can create any number of times. This is the pattern we'll normally want to follow when building our app - create a subclass of an existing component then create an instance of it later. Let's take a look through what we just changed:

* Ext.define allows us to create a new class, extending an existing one (Ext.Panel in this case)
* We followed the MyApp.view.MyView convention for our new view class. You can name it whatever you like but we suggest sticking with convention
* We defined config for the new class inside a config object

Any of the config options available on Ext.Panel can now be specified in either our new class's config block or when we come to create our instance. When defining a subclass be sure to use the config object, when creating just pass in an object.

For example, here's the same code again but with additional configuration passed in with our Ext.create call:

    @example
    Ext.define('MyApp.view.Welcome', {
        extend: 'Ext.Panel',
        
        config: {
            html: 'Welcome to my app',
            fullscreen: true
        }
    });
    
    Ext.create('MyApp.view.Welcome', {
        styleHtmlContent: true
    });

## A Real World Example

This is one of the view classes from our Twitter app:

    Ext.define('Twitter.view.SearchBar', {
        extend: 'Ext.Toolbar',
        xtype : 'searchbar',
        requires: ['Ext.field.Search'],

        config: {
            ui: 'searchbar',
            layout: 'vbox',
            cls: 'big',

            items: [
                {
                    xtype: 'title',
                    title: 'Twitter Search'
                },
                {
                    xtype: 'searchfield',
                    placeHolder: 'Search...'
                }
            ]
        }
    });

This follows the same pattern as before - we've created a new class called Twitter.view.SearchBar, which extends the framework's Ext.Toolbar class. We also passed in some configuration options, including a layout and an {@link Ext.Container#cfg-items items} array.

We've used a couple of new options this time:

* **requires** - because we're using a searchfield in our items array, we tell our new view to require the Ext.field.Search class. At the moment the dynamic loading system does not recognize classes specified by xtype so we need to define the dependency manually
* **xtype** - gives our new class its own xtype, allowing us to easily create it in a configuration object (just like we did with searchfield above)

This allows us to create instances of our new view class in a couple of ways:

    //creates a standalone instance
    Ext.create('Twitter.view.SearchBar');
    
    //alternatively, use xtype to create our new class inside a Panel
    Ext.create('Ext.Panel', {
        html: 'Welcome to my app',
        
        items: [
            {
                xtype: 'searchbar',
                docked: 'top'
            }
        ]
    });

## Custom Configurations and Behavior

Sencha Touch 2 makes extensive use of the configuration system to provide predictable APIs and keep the code clean and easily testable. We strongly suggest you do the same in your own classes.

Let's say you want to create a image viewer that pops up information about the image when you tap on it. Our aim is to create a reusable view that can be configured with the image url, title and description, and displays the title and description when you tap on it.

Most of the work around displaying images is taken care of for us by the Ext.Img component, so we'll subclass that:

    @example
    Ext.define('MyApp.view.Image', {
        extend: 'Ext.Img',
        
        config: {
            title: null,
            description: null
        },
        
        //sets up our tap event listener
        initialize: function() {
            this.callParent(arguments);
            
            this.element.on('tap', this.onTap, this);
        },
        
        //this is called whenever you tap on the image
        onTap: function() {
            Ext.Msg.alert(this.getTitle(), this.getDescription());
        }
    });
    
    //creates a full screen tappable image
    Ext.create('MyApp.view.Image', {
        title: 'Orion Nebula',
        description: 'The Orion Nebula is rather pretty',
        
        src: 'http://apod.nasa.gov/apod/image/1202/oriondeep_andreo_960.jpg',
        fullscreen: true
    });

We're adding two more configurations to our class - title and description - which both start off as null. When we create an instance of our new class we pass the title and description configs in just like any other configuration.

Our new behavior happens in the initialize and onTap functions. The initialize function is called whenever any component is instantiated, so is a great place to set up behavior like event listeners. The first thing we do is use this.callParent(arguments) to make sure the superclass' initialize function is called. **This is very important**, omitting this line may cause your components not to behave correctly.

After callParent, we add a tap listener to the component's element, which will call our onTap function whenever the element is tapped. All components in Sencha Touch 2 have an element property that you can use in this way to listen to events on the DOM objects, add or remove styling, or do anything else you'd normally do to an Ext.dom.Element.

The onTap function itself is pretty simple, it just uses Ext.Msg.alert to quickly pop up some information about the image. Note that our two new configs - title and description - both receive generated getter functions (getTitle and getDescription respectively), as well as generated setter functions (setTitle and setDescription).

## Advanced Configurations

When you create a new configuration option to a class, the getter and setter functions are generated for you so a config called 'border' is automatically given getBorder and setBorder functions:

    @example
    Ext.define('MyApp.view.MyView', {
        extend: 'Ext.Panel',
        
        config: {
            border: 10
        }
    });
    
    var view = Ext.create('MyApp.view.MyView');
    
    alert(view.getBorder()); //alerts 10
    
    view.setBorder(15);
    alert(view.getBorder()); //now alerts 15

The getter and setter aren't the only functions that are generated, there are a couple more that make life as a component author much simpler - applyBorder and updateBorder:

    Ext.define('MyApp.view.MyView', {
        extend: 'Ext.Panel',
        
        config: {
            border: 0
        },
        
        applyBorder: function(value) {
            return value + "px solid red";
        },
        
        updateBorder: function(newValue, oldValue) {
            this.element.setStyle('border', newValue);
        }
    });

Our applyBorder function is called internally any time the border configuration is set or changed, including when the component is first instantiated. This is the best place to put any code that transforms an input value. In this case we're going to take the border width passed in an return a CSS border specification string.

This means that when we set the view's border config to 10, our applyBorder function will make sure that we transform that value to '10px solid red'. The apply function is totally optional but note that you must **return** a value from it or nothing will happen.

The updateBorder function is called *after* the applyBorder function has had a chance to transform the value, and is usually used to modify the DOM, send AJAX requests or perform any other kind of processing. In our case we're just getting the view's element and updating the border style using {@link Ext.dom.Element#setStyle setStyle}. This means that every time setBorder is called our DOM will immediately be updated to reflect the new style.

Here's an example of the new view in action. Click the Code Editor button to see the source - basically we just create an instance of the new view and dock a {@link Ext.field.Spinner spinner field} at the top, allowing us to change the border width by tapping the spinner buttons. We hook into the Spinner's {@link Ext.field.Spinner#event-spin spin} event and call our view's new setBorder function from there:

    @example preview
    //as before
    Ext.define('MyApp.view.MyView', {
        extend: 'Ext.Panel',
        
        config: {
            border: 0
        },
        
        applyBorder: function(value) {
            return value + "px solid red";
        },
        
        updateBorder: function(newValue, oldValue) {
            this.element.setStyle('border', newValue);
        }
    });
    
    //create an instance of MyView with a spinner field that updates the border config
    var view = Ext.create('MyApp.view.MyView', {
        border: 5,
        fullscreen: true,
        styleHtmlContent: true,
        html: 'Tap the spinner to change the border config option',
        items: {
            xtype: 'spinnerfield',
            label: 'Border size',
            docked: 'top',
            value: 5,
            minValue: 0,
            maxValue: 100,
            increment: 1,
            listeners: {
                spin: function(spinner, value) {
                    view.setBorder(value);
                }
            }
        }
    });

## Usage in MVC

We recommend that most Sencha Touch applications should follow the <a href="#!/guide/apps_intro">MVC conventions</a> so that your code remains well organized and reusable. As the "V" in MVC, views also fit into this structure. The conventions around views in MVC are very simple and follow directly from the naming convention we used above.

Our *MyApp.view.MyView* class should be defined inside a file called *app/view/MyView.js* - this allows the Application to find and load it automatically. If you're not already familiar with the file structure for MVC-based Sencha Touch apps, it's pretty simple - an app is just an html file, an *app.js* and a collection of models, views and controllers inside the *app/model*, *app/view* and *app/controller* directories:

    index.html
    app.js
    app/
        controller/
        model/
        view/
            MyView.js

You can create as many views as you want and organize them inside your *app/view* directory. By specifying your application's views inside your app.js they'll be loaded automatically:

    //contents of app.js
    Ext.application({
        name: 'MyApp',
        views: ['MyView'],
        
        launch: function() {
            Ext.create('MyApp.view.MyView');
        }
    });

By following the simple view naming conventions we can easily load and create instances of our view classes inside our application. The example above does exactly that - loads the MyView class and creates an instance of it in the application launch function. To find out more about writing MVC apps in Sencha Touch please see the <a href="#!/guide/apps_intro">intro to apps guide</a>.