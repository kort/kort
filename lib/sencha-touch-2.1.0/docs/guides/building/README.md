# Using and Creating Builds

Sencha Touch 2 comes with a brand new class system that features an ability to dynamically load classes when they are needed. This has many benefits in both development and production.

In development, dynamic loading means you get a file-by-file stack trace, which makes it much easier to debug problems with your application. For production, we provide a build tool that enables you to easily create a minified custom build that only includes the classes your app actually uses, meaning loading times are often reduced for your users.

## Choosing a Build

Sencha Touch 2 ships with 5 builds out of the box. If you just want to get up and running as quickly as possible it's best to simply use sencha-touch-debug.js while developing your app locally then switch to sencha-touch.js in production. The other three builds are good for debugging in production, running in production without a custom build, and migrating your 1.x app to 2.x.

Because each build is good for a different purpose an created using a different set of build options we've created a simple table below that shows how each one is configured:

<style type="text/css" media="screen">
    .guide-container table {
        width: 900px;
        font-size: 0.9em;
    }

    .guide-container table th {
        background-color: #eee;
        font-weight: bold;
        text-align: center;
        color: #333;
        padding: 1px 2px;
    }
    
    .guide-container table td {
        padding: 3px;
    }
</style>

<table class="info">
    <tr>
        <th>Name</th>
        <th>Type</th>
        <th>Loader</th>
        <th>Minified</th>
        <th>Comments</th>
        <th>Debug</th>
        <th>Compat</th>
        <th>Usage</th>
    </tr>
    <tr>
        <th>sencha-touch-debug.js</th>
        <td>Core</td>
        <td>{@img tick.png}</td>
        <td></td>
        <td>{@img tick.png}</td>
        <td>{@img tick.png}</td>
        <td></td>
        <td>Use when developing your app locally</td>
    </tr>
    <tr>
        <th>sencha-touch.js</th>
        <td>Core</td>
        <td></td>
        <td>{@img tick.png}</td>
        <td></td>
        <td></td>
        <td></td>
        <td>Use in production with a custom build</td>
    </tr>
    <tr>
        <th>builds/sencha-touch-all.js</th>
        <td>All</td>
        <td></td>
        <td>{@img tick.png}</td>
        <td></td>
        <td></td>
        <td></td>
        <td>Use in production if you don't have a custom build</td>
    </tr>
    <tr>
        <th>builds/sencha-touch-all-debug.js</th>
        <td>All</td>
        <td></td>
        <td></td>
        <td>{@img tick.png}</td>
        <td>{@img tick.png}</td>
        <td></td>
        <td>Use to debug your app in staging/production</td>
    </tr>
    <tr>
        <th>builds/sencha-touch-all-compat.js</th>
        <td>All</td>
        <td></td>
        <td></td>
        <td>{@img tick.png}</td>
        <td>{@img tick.png}</td>
        <td>{@img tick.png}</td>
        <td>Use to migrate your 1.x app to 2.x</td>
    </tr>
</table>

Note that the last 3 builds are contained within the 'builds' directory in the SDK download. If the table above is not self-explanatory, here's a little more detail on what each option means:

<ul>
    <li><strong>Type</strong>: either "Core" or "All" - Core includes the base classes but none of the Components, All means everything is included</li>
    <li><strong>Loader</strong>: whether dynamic loading is activated or not. Only sencha-touch-debug.js has this activated by default</li>
    <li><strong>Minified</strong>: means the build has been compressed with YUI compressor</li>
    <li><strong>Comments</strong>: means the build still contains the JSDoc comments (these are usually stripped in production to speed up downloads)</li>
    <li><strong>Debug</strong>: means that the build will give you debug messages such as telling you if you have misconfigured a class</li>
    <li><strong>Compat</strong>: means that code to provide backwards compatibility with Sencha Touch 1.x is present in the build</li>
</ul>

Again, use sencha-touch-debug.js in development mode then switch to either sencha-touch.js or sencha-touch-all.js plus a custom build in production.

## Creating your own Build

In the vast majority of cases a Sencha Touch 2 app should use a custom build in production, for 2 main reasons:

1. Custom builds include **only** the framework classes your app is actually using, saving on download time
2. A custom build includes all of your app classes in a single file, which means only one network request

Reason 2 is especially important. Most applications will have a large number of files (sometimes hundreds), and loading them one by one, especially over a 3g network, can take a long time. That's because each request can add several hundred milliseconds of delay, depending on network conditions, which can easily add several seconds to your application's overall load time.

To ensure your applications load quickly in production we have created the <a href="http://www.sencha.com/products/sdk-tools">Sencha SDK Tools</a>, which includes a build script that automatically does all of this:

1. Figures out which framework classes your application is actually using
2. Figures out which application classes are loaded when your application boots up
3. Combines all of these into a single file, with the classes in the right order
4. Strips out all of the JSDoc comments, then minifies the file so it's as small as possible

### Installing the SDK Tools

If you don't already have the Sencha SDK Tools installed, you'll need to install them before you can create a build. A quick way to check to see if the tools are already installed is to open up your command line terminal and type in 'sencha' - if the SDK Tools are present you should see something like this:

{@img installed-test.png Output of running 'sencha' on the command line if the SDK Tools are installed}

If you get an error instead you probably don't have the SDK Tools installed. Just hit the download button on <a href="http://www.sencha.com/products/sdk-tools">http://www.sencha.com/products/sdk-tools</a>, double-click the downloaded file to install then try the *sencha* command again and everything should work.

### Generating a Build

** Note: ** ***The build steps are expected to be simplified in the next release (2.0.0 Beta 2) so please check this page again once that release is available.***

We're going to assume you have an app that works locally already and that you just want to build it for production. If you don't have an app yet or don't know what this is all about, check out the <a href="#!/guide/apps_intro">getting started guide</a>.

Assuming you app does work locally though, let's proceed. We're going to use the Twitter example that comes with the Sencha Touch SDK to illustrate how this works. Firstly let's familiarize ourselves with that example's index.html file:

    <!DOCTYPE html>
    <html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <title>Twitter</title>

        <link rel="stylesheet" href="resources/css/application.css" type="text/css">

        <script type="text/javascript" src="touch/sencha-touch-debug.js"></script>
        <script type="text/javascript" src="app.js"></script>
    </head>
    <body></body>
    </html>

Notice that we're loading sencha-touch-debug.js and app.js - this combination is what allows us to use dynamic loading while developing our app, and is the basis for the SDK Tools' ability to generate a minimal build. We'll come back to this html file's contents shortly.

Back to the command line - first you'll need to cd into to the directory that your app can be found in on your hard drive:

    cd ~/path/to/my/app

Next you'll need to generate a jsb file for your app. A jsb file is basically a list of all the classes that your application uses. Thankfully, the SDK Tools do this for you:

    sencha create jsb -a index.html -p app.jsb3

This command takes your index.html file (the same file you use in your browser while developing your app), figures out all of the class dependencies and writes them out into a file called *app.jsb3*. From here we just need one more command to actually generate the build itself:

    sencha build -p app.jsb3 -d ./

This final command takes all of the files listed in the jsb and combines them into a single file, which it then minifies to make as small as possible. The output is a file called all-classes.js, which contains all of the framework classes plus your application classes. 

### Updating your HTML file

The final step to prepare your app for production is to update your HTML file to use sencha-touch.js instead of sencha-touch-debug.js, and to load your newly-generated all-classes.js. Here's how our twitter example file ends up:

    <!DOCTYPE html>
    <html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <title>Twitter</title>

        <link rel="stylesheet" href="resources/css/application.css" type="text/css">

        <script type="text/javascript" src="touch/sencha-touch.js"></script>
    	<script type="text/javascript" src="all-classes.js"></script>
        <script type="text/javascript" src="app.js"></script>
    </head>
    <body></body>
    </html>

Rather than change your main index.html file all the time, it's common to create a duplicate called index-production.html that looks like the file above. Many developers will produce a simple deploy script that copies the app into a deploy folder and renames index-production.html to index.html automatically so that the build can simply be uploaded.

### Upcoming Changes to the Builder

Although it's only a few steps, we'd like to improve both the workflow and the output of the builder for the next release of Sencha Touch. If you're building using Sencha Touch 2.0 beta 1 please be sure to check back when you upgrade to a later release as it is likely the steps and output will have changed slightly.