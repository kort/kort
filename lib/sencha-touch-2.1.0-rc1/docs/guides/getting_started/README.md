# Getting Started with Sencha Touch 2

{@video vimeo 37974749}

## What is Sencha Touch?

Sencha Touch enables you to quickly and easily create HTML5 based mobile apps that work on Android, iOS and Blackberry devices and produce a native-app-like experience inside a browser.

## Things you'll need

First, you'll need to download the free [Sencha Touch 2 SDK](http://www.sencha.com/products/touch/download/) and
[SDK Tools](http://www.sencha.com/products/sdk-tools/download) from the Sencha website. You'll also need:

 - A web server running locally on your computer
 - A modern web browser; [Chrome](https://www.google.com/chrome) and [Safari](http://www.apple.com/safari/download/) are recommended

 If you are running IIS on Windows, please note that you must add `application/x-json` as a MIME Type for Sencha Touch to work properly. You can find out how to do that here: [http://stackoverflow.com/a/1121114/273985](http://stackoverflow.com/a/1121114/273985).

## Installation

First, extract your SDK zip file to your projects directory. Ideally, this folder will be accessible by your HTTP server.
For example, you should be able to navigate to http://localhost/sencha-touch-2.0.0-gpl from your web browser and see the
Sencha Touch documentation.

You'll also need to run the SDK Tools installer. The SDK Tools will add the **`sencha`** command line tool to your path
so that you can generate a fresh application template among other things. To check you have installed the SDK tools,
change to your Sencha Touch directory and type the `sencha` command. For example:

    $ cd ~/webroot/sencha-touch-2.0.0-gpl/
    $ sencha
    Sencha Command v2.0.0 for Sencha Touch 2
    Copyright (c) 2012 Sencha Inc.
    ...

__Note:__ You **must** be inside either the downloaded SDK directory or a generated Touch app when using the **`sencha`** command.

## Generating your first app

Now you have Sencha Touch and the SDK Tools installed, lets generate an application. Make sure you're still in the
Sencha Touch SDK folder, and type the following:

    $ sencha generate app GS ../GS
    [INFO] Created file /Users/nickpoulden/Projects/sencha/GS/.senchasdk
    [INFO] Created file /Users/nickpoulden/Projects/sencha/GS/index.html
    [INFO] Created file /Users/nickpoulden/Projects/sencha/GS/app.js
    ...

This will generate a skeleton Sencha Touch application namespaced to the `GS` variable (short for Getting Started) and
located in the directory `../GS` (one level up from the Sencha Touch SDK directory). The skeleton app contains all the
files you need to create a Touch application, including the default index.html, a copy of the Touch SDK, CSS, images and
configuration files for packaging your app for native.

Lets check if your application has generated successfully by opening it in a web browser. Assuming you extracted the SDK
to your webroot folder, you should be able to nativate to `http://localhost/GS` and see the default app:

{@img screen1.png}

## Explore the code

Open up the GS directory in your favorite IDE or Text editor. The directory structure looks like this:

{@img files.png}

Here's a description of each file and directory:

  - **`app`** - directory containing the Models, Views, Controllers and Stores for your app.
  - **`app.js`** - the main Javascript entry point for your app.
  - **`app.json`** - your app configuration file - used by the Builder to create a minified version of your app.
  - **`index.html`** - The HTML file for your app.
  - **`packager.json`** - The configuration file used by the Packager to create native versions of your app for iOS and Android app stores.
  - **`resources`** - directory containing the CSS and Images for your app
  - **`sdk`** - A copy of the Sencha Touch SDK. You shouldn't need to change the contents of this folder.

Open `app.js`, the main entry point for your app, in your editor.

{@img appjs.png}

The `launch` function is the entry point to your application. In the default application, we first hide the application
loading indictor, then create an instance of our Main view and add it to the Viewport.

The Viewport is a {@link Ext.layout.Card Card layout} to which you can add components to your application. The default
app adds the `Main` view to the viewport so it is visible on the screen. Lets look at the code inside the Main view.

Open `app/view/Main.js` in your code editor and try editing line 10 to this:

    title: 'Home Tab'

Now change line 19 to this:

    title: 'Woohoo!'

Also, change lines 22-26 to this:

    html: [
        "I changed the default <b>HTML Contents</b> to something different!"
    ].join("")

Now refresh the app in your browser to see your changes:

{@img changed.png}

## Next Steps

The next step is to follow the [First Application guide](#!/guide/first_app), which builds on what you've
just done and guides your through creating a simple but powerful app in around 15 minutes. You can also follow along
with the video at the top of this guide.

If you'd like to skip ahead or find out more detailed information about other aspects of the framework we recommend
checking out the following guides and resources:

### Guides

* [Components and Containers](#!/guide/components)
* [Intro to Applications](#!/guide/apps_intro)
* [The Layout System](#!/guide/layouts)
* [The Data Package](#!/guide/data)
* [What's New in Sencha Touch 2](#!/guide/whats_new)

### Application Examples

* [Kitchen Sink](#!/example/kitchen-sink)
* [Twitter](#!/example/twitter)
* [Kiva](#!/example/kiva)

### Component Examples

* [Carousel](#!/example/carousel)
* [Forms](#!/example/forms)
* [Date Picker](#!/example/pickers)
