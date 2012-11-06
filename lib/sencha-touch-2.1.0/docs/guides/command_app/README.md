# Using Sencha Cmd with Sencha Touch

{@img ../command/sencha-command-128.png}

## Introduction

This guide walks through the process of using Sencha Cmd with Sencha Touch
applications starting with the `sencha generate app` command and ending with a
running application.

This guide applies to both new Sencha Touch applications as well as upgrades of
existing Sencha Touch 2 applications.

For a general introduction, see [Introducing Sencha Cmd](#/guide/command).

To share code between Sencha Touch applications or between Sencha Touch and Ext JS, please
refer to [Workspaces in Sencha Cmd](#/guide/command_workspace).

## Creating a New Application

The following command generates a new application with the namespace `MyApp` to
"/path/to/www/myapp":

    #  Make sure the current working directory is the Sencha Touch 2 SDK
    cd /path/to/sencha-touch-2-sdk
    sencha app create MyApp /path/to/www/myapp

Or, you can specify the path to the SDK on the command line:

    sencha -sdk /path/to/sencha-touch-2-sdk app create MyApp /path/to/www/myapp

To try it out, simply point any WebKit-based browser to `http://localhost/myapp`.

Congratulations. You have just created a fully working Sencha Touch 2 application in seconds.

## Understanding Your Application's Structure

The generated application should have the following file structure:

    .sencha/                # Sencha-specific files (e.g. configuration)
        app/                # Application-specific content
            sencha.cfg      # Configuration file for Sencha Cmd
            plugin.xml      # Plugin for Sencha Cmd
        workspace/          # Workspace-specific content (see below)
            sencha.cfg      # Configuration file for Sencha Cmd
            plugin.xml      # Plugin for Sencha Cmd

    touch/                  # A copy of the Sencha Touch SDK
        cmd/                # Sencha Touch-specific content for Sencha Cmd
            sencha.cfg      # Configuration file for Sencha Cmd
            plugin.xml      # Plugin for Sencha Cmd
        src/                # The Sench Touch source
        sencha-touch-*.js   # Pre-compiled and bootstrap files
        ...

    app                     # Your application's source code in MVC structure
        controller
        model
        profile
        store
        view
            Main.js         # The main view of the application

    resources
        css
            app.css         # The main stylesheet, compiled from app.scss

        sass
            app.scss        # The SASS file which compiles to app.css above,
                            # includes Sencha Touch 2 theme by default

        icons               # Application icons for all mobile devices
                            # When replacing these default images with your own,
                            # make sure the file name and the dimension stays exactly the same
            ...
        loading             # Application start-up screens for iOS devices
                            # Similarly to icons, make sure the file names and
                            # dimension stays the same
            ...
        images              # Put other images used by your application here

    index.html
    app.js                  # Contains application's initialization logics
    app.json                # Configuration for deployment
    packager.json           # Configuration for native packaging

Both "app.json" and "packager.json" have inline documentation for each configurable item. Simply
open the files and edit them as you need.

## Developing Your Application

Using the family of `sencha generate` commands will help you quickly generate common MVC
components. 

**Important.** Be sure to make your current directory your application's root folder.

For example:

    cd /path/to/www/myapp
    sencha generate model User --fields=id:int,name,email

This command generates a new Model class named `User` with three fields named `id`, `name`, and
`email` to "app/model/User.js" and add its reference to your "app.js" file.

## Upgrading Your Application

Generated applications always have their own copies of the SDK from which they were
originally generated. Upgrading your application to a new version of the SDK means that you
have to replace the old version with the new one. Do this with the command `sencha app upgrade`.
 
**Important.** Be sure to make your current directory your application's root folder.

Here's a more complete example:

    cd /path/to/www/myapp
    sencha app upgrade /path/to/new_version_of_sdk

## Deploying Your Application

Developing your application simply means editing source code and refreshing the browser.
All source files are dynamically loaded on demand. There's no building process involved.
When it comes to deployment, Sencha Cmd provides the following four build environment options:

 
 - `testing` - intended for QA prior to production. All JavaScript and CSS source files are
 bundled, but not minified, which makes it easier to debug.
 - `package` - creates a self-contained, redistributable production build that normally runs
 from the local file system without a web server.
 - `production` - creates a production build that is normally hosted on a web server and
 serves multiple clients (devices). The build is offline-capable using HTML 5 application
 cache, and is enabled to perform over-the-air updates.
 - `native` - first generates a `package` build, then packages it as a native application,
 ready to be deployed to native platforms.

As an example, the following command generates a `testing` build of your application.

**Important.** Be sure to make your current directory your application's root folder.

    cd /path/to/www/myapp
    sencha app build testing

And similarly when you're ready for production deployment:

    cd /path/to/www/myapp
    sencha app build production

The default deployment paths are taken from the `buildPaths` item inside `app.json`. For
more details on optional arguments, run the following command:

    cd /path/to/www/myapp
    sencha help app build

Sencha Cmd automates all optimizations for your application, including the following:

- Resolving dependencies required by the application and only including exactly what is
  used for optimal file size/performance.
- Enabling HTML 5 application cache via automatic generation of "cache.manifest" and resources
  checksum.
- Minifying all JavaScript and CSS assets.
- Storing all JavaScript and CSS assets inside local storage on first load and patching them
  via delta updates between releases.

As a result, your production build can load instantly on subsequent access and updates on the
fly with minimal network transfer.

**Important.** The `cache.manifest` file is automatically generated for you. Make sure your
web server serves it with the correct `Content-Type` header of `text/cache-manifest`. To learn
more about HTML 5 application cache, see the HTML5 Rocks tutorial
[A Beginner's Guide to Using the Application Cache](http://www.html5rocks.com/en/tutorials/appcache/beginner/).

## Packaging Your Application for Distribution on App Stores

`packager.json` contains all configurable values to package your application.

If you're using OS X and have Xcode installed, the following command packages your
application and runs it on the iOS Simulator:

    sencha app build native

For more details on working with `packager.json`, please refer to the
[Native Package guide](#!/guide/native_packaging)

## Troubleshooting

For common problems using Sencha Cmd, see the Troubleshooting section of
[Introduction to Sencha Cmd](#/guide/command).

### Errors While Resolving Dependencies - Part 2

The new Sencha Cmd compiler is used by default to determine dependencies. Unlike previous
releases, the compiler determines dependencies by processing source code (application and
framework). In some cases this can lead to missing dependencies, that is, dependencies
that were automatically detected in previous releases but are not detected by the compiler.

The ideal solution in this case is to add the missing `requires` statements to resolve the
issue. This may include switching overrides to the new, named form, such as:

    Ext.define('MyApp.patches.foo.Bar', {
        override: 'Ext.foo.Bar',
        ...
    });

This enables overrides to be required by their name and therefore for the compiler to
process them in the right sequence.

If that effort needs to be postponed, you can enable V2 compatibility mode (based on
launching your application via file system protocol inside of a headless WebView to
extract dependencies). To do this, use this command instead of `sencha app build`:

    sencha config -prop v2deps=true then app build

Alternatively, you could add the following line to your ".sencha/app/sencha.cfg" file and
run `sencha app build` as before:

    v2deps=true

In this legacy mode, if your application relies on any dynamic server-side scripting (for
example, loading a class configuration from a PHP script), you must set the `url` item
inside `app.json` to the absolute URL from which your application can be loaded on a web
browser. For example:

    // app.json
    {
        "url": "http://localhost/myapp/",
        // ...
    }

This should be viewed as a temporary measure, since it won't allow planned compiler
optimizations to automatically benefit your application.
