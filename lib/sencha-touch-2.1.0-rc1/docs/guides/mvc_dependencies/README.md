# Managing Dependencies with MVC

There are two main places that dependencies can be defined in a Sencha Touch 2 app - on the application itself or inside the application classes. This guide gives some advice on how and where to declare dependencies in your app.

## Application Dependencies

When you create an MVC application, your Ext.application gives you a convenient way of specifying the models, views, controllers, stores and profiles that your application uses. Here's an example:

    Ext.application({
        name: 'MyApp',
        
        views: ['Login'],
        models: ['User'],
        controllers: ['Users'],
        stores: ['Products'],
        profiles: ['Phone', 'Tablet']
    });

These 5 configuration options are convenient ways to load the types of files that applications usually consist of - models, views, controllers, stores and profiles. Specifying these configurations means your application will automatically load the following files:

* app/view/Login.js
* app/model/User.js
* app/controller/Users.js
* app/store/Products.js
* app/profile/Phone.js
* app/profile/Tablet.js

In terms of what gets loaded, the example above is equivalent to defining dependencies manually like this:

    Ext.require([
        'MyApp.view.Login',
        'MyApp.model.User',
        'MyApp.controller.Users',
        'MyApp.store.Products',
        'MyApp.profile.Phone',
        'MyApp.profile.Tablet'
    ]);

As you add more classes to your application, these configurations become more and more useful in helping you avoid typing out the full class names for every file. Be aware, however, that three of those configurations do more than just load files. As well as loading the files, they do the following:

* **profiles** - instantiates each Profile and determines if it should be {@link Ext.app.Profile#isActive active}. If so, the Profile's own dependencies are also loaded
* **controllers** - instantiates each Controller after loading
* **stores** - instantiates each Store, giving it a default store ID if one is not specified

What this means is that if you want to take advantage of all of the convenience MVC offers you, you're advised to use these configuration options when defining your application dependencies. 

## Profile-specific Dependencies

When using <a href="#!/guide/profiles">Device Profiles</a>, chances are it means you have some classes that are used only on certain devices. For example, the Tablet version of your app probably contains more functionality than the Phone version, which usually means it will need to load more classes. Additional dependencies can be specified inside each Profile:

    Ext.define('MyApp.profile.Tablet', {
        extend: 'Ext.app.Profile',
        
        config: {
            views: ['SpecialView'],
            controllers: ['Main'],
            models: ['MyApp.model.SuperUser']
        },
        
        isActive: function() {
            return Ext.os.is.Tablet;
        }
    });

Now what's going to happen here is that the dependencies specified in each Profile are going to be loaded regardless of whether or not the Profile is active. The difference is, even though they're loaded, the Application knows not to do the additional processing like instantiating profile-specific Controllers if the profile is not active.

This probably sounds counter-intuitive - why download classes that aren't going to be used? The reason we do this is to produce a universal production build that can be deployed to any device, detect which profile it should use and then boot the app. The alternative is to create custom builds for each profile, craft a micro-loader than can detect which profile a device should activate and then download the code for that profile.

While the universal build approach does mean you're downloading code you don't need on every device, for the vast majority of apps this amounts to so little additional size it's difficult to detect the difference. For very large apps the difference will become more noticeable so it's possible we'll revisit this subject after 2.0.

## Nested Dependencies

For larger apps it's common to split the models, views and controllers into subfolders so keep the project organized. This is especially true of views - it's not unheard of for large apps to have over a hundred separate view classes so organizing them into folders can make maintenance much simpler.

To specify dependencies in subfolders just use a period (".") to specify the folder:

    Ext.application({
        name: 'MyApp',

        controllers: ['Users', 'nested.MyController'],
        views: ['products.Show', 'products.Edit', 'user.Login']
    });

In this case these 5 files will be loaded:

* app/controller/Users.js
* app/controller/nested/MyController.js
* app/view/products/Show.js
* app/view/products/Edit.js
* app/view/user/Login.js

Note that we can mix and match within each configuration here - for each model, view, controller, profile or store you can specify either just the final part of the class name (if you follow the directory conventions), or the full class name.

## External Dependencies

We can specify application dependencies from outside our application by fully-qualifying the classes we want to load. A common use case for this is sharing authentication logic between multiple applications. Perhaps you have several apps that login via a common user database and you want to share that code between them. An easy way to do this is to create a folder alongside your app folder and then add its contents as dependencies for your app.

For example, let's say our shared login code contains a login controller, a user model and a login form view. We want to use all of these in our application:

    Ext.Loader.setPath({
        'Auth': 'Auth'
    });

    Ext.application({
        views: ['Auth.view.LoginForm', 'Welcome'],
        controllers: ['Auth.controller.Sessions', 'Main'],
        models: ['Auth.model.User']
    });

This will load the following files:

* Auth/view/LoginForm.js
* Auth/controller/Sessions.js
* Auth/model/User.js
* app/view/Welcome.js
* app/controller/Main.js

The first three were loaded from outside our application, the last two from the application itself. Note how we can still mix and match application files and external dependency files.

Note that to enable the loading of external dependencies we just have to tell the Loader where to find those files, which is what we do with the Ext.Loader.setPath call above. In this case we're telling the Loader to find any class starting with the 'Auth' namespace inside our 'Auth' folder. This means we can drop our common Auth code into our application alongside the app folder and the framework will be able to figure out how to load everything.

## Where Each Dependency Belongs

The general rule when deciding where to declare each dependency is to keep your classes completely self-contained. For example, if you have a view that contains several other views, you should declare those dependencies inside the view class, not the application:

    Ext.define('MyApp.view.Main', {
        extend: 'Ext.Container',
        
        requires: [
            'MyApp.view.Navigation',
            'MyApp.view.MainList'
        ],
        
        config: {
            items: [
                {
                    xtype: 'navigation'
                },
                {
                    xtype: 'mainlist'
                }
            ]
        }
    });

And in your app.js:

    Ext.application({
        views: ['Main']
    });

This is the best way to declare those dependencies for two reasons - it keeps your app.js clean and enables you to reliably require your MyApp.view.Main and know that it already has all of its dependencies satisfied. The alternative would be to list all of your views inside your app.js like this:

    //this is bad
    Ext.application({
        views: ['Main', 'Navigation', 'MainList']
    });

A simple way of thinking about this is that app.js just contains top-level views. If you use Ext.create('MyApp.view.SomeView') inside your app, that view can be considered top-level. If a view is only ever constructed as a sub-view of another view (as with MyApp.view.Navigation and MyApp.view.MainList above), it doesn't belong in app.js.

## Changes since 1.x

In Sencha Touch 1, dependencies were often specified in Controllers as well as in the Ext.application call. While this offered some conveniences, it also masked the true architecture of the system and coupled views, models and stores too closely to controllers. Here's what you could do in 1.x:

    //1.x code, deprecated
    Ext.regController('SomeController', {
        views: ['Login'],
        models: ['User'],
        stores: ['Products']
    });

This is exactly the same as defining the views, models and stores inside Ext.application, but also gave some convenience methods for accessing those classes inside your controller. 1.x generated two functions - *getLoginView()* and *getUserModel()* - and exposed a *getStore()* function that returned a reference to any of the Stores you defined in this Controller. In 2.x these functions no longer exist, but it's easy to use the alternatives.

In each case here the first line refers to Sencha Touch 1.x, with the second line showing the 2.x way:

    //creating a view - 2.x uses the standardized Ext.create
    this.getLoginView().create();
    Ext.create('MyApp.view.Login');

    //getting a Model - just type out the Model name (it's shorter and faster)
    this.getUserModel();
    MyApp.model.User;

    //Ext.getStore can access any Store whereas the old this.getStore only
    //accessed those Stores listed in your Controller
    this.getStore('Products');
    Ext.getStore('Products');

Removing these functions speeds up application launching because the framework no longer needs to generate one function for each model and view defined in each Controller. It also means that the conventions for MVC match the conventions for the rest of the framework, leading to a more predictable API.