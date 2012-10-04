/**

# Jog With Friends - by Nick Poulden

This demo app shows off how to use Facebook with Sencha Touch. To see the app in action, visit:

http://ju.mp/senchajwf

This example uses the Facebook Javascript SDK on the client side, node.js for the server side and
MongoDB for the database.

In order to run this example app, you'll need to set up a Facebook application and deploy the app
to a public server. Below we outline how to do so using free accounts from Heroku and MongoLabs.

## Set up Heroku

We assume you're familiar with Git and have it installed.

  1. Visit http://www.heroku.com and sign up.
  2. Download the Heroku command line toolbelt from http://toolbelt.herokuapp.com/
  3. From your command line, type `heroku login` and enter your account details.
  4. Change to the server-side subdirectory of this example.
  5. Set up a git repository:

        $ git init

  6. Create a new app on Heroku:

        heroku create --stack cedar

    Note the URL of your live app.

## Set up Facebook

  1. Visit https://developers.facebook.com/apps and click the 'Create New App' button.
  2. Fill in the App Display Name and leave the Namespace field blank.
  3. Note the App ID and App Secret.
  4. In the 'Select how your app integrates with Facebook' section, click the 'Mobile Web' option
     and use the domain created for your app on Heroku.

## Set up MongoDB

  1. Visit https://mongolab.com and sign up.
  2. In the 'Databases' section, click 'Add'.
  3. Select the 'Free' plan on Amazon EC2, pick a database name, username and password.
  4. Click on your new database and note the connection URL. It should look something like this:

       mongodb://<user>:<password>@ds029807.mongolab.com:29807/<databaseName>

## Set up the Sencha Touch app

  1. Fill in your Facebook app ID in the `launch` function at the bottom of this file.
  2. Open `server-side/app.js` and fill in the config options at the top:

       - `redirect_uri`   The Heroku app URL
       - `client_id`      Your Facebook app ID
       - `client_secret`  Your Facebook app secret
       - `mongoDb`        Mongo connection URL from above
       - `sessionSecret`  A random string of characters for session encryption

## Build and Deploy your app

  1. Edit `build.sh` in the run-with-friends example folder
  2. Make sure the path to `sencha-touch.js` on the last line of build.sh is correct
  3. Run build.sh
  4. Change to the `server-side` directory
  5. Run the following git commands:

        $ git add .
        $ git commit -m "Initial commit"
        $ git push heroku master

## Check your app

Visit your live Heroku URL from your mobile device or Webkit based browser.

*/
Ext.application({
    name: 'JWF',

    icon: 'resources/icons/icon.png',
    phoneStartupScreen:  'resources/images/phone_startup.png',

    models: [
        'Run'
    ],

    views: [
        'Main',
        'Form',
        'Login'
    ],

    controllers: [
        'Facebook',
        'Runs'
    ],

    stores: [
        'Runs'
    ],

    viewport: {
        autoMaximize: true
    },

    launch: function() {

        this.facebookAppId = '';

        if (this.facebookAppId === '') {
            Ext.create('Ext.Component', {
                fullscreen: true,
                padding: 20,
                html: [
                    '<p>Please read the source of app.js to set up this example locally.</p><br/>',
                    '<p>For a live example, visit <a href="http://ju.mp/senchajwf">http://ju.mp/senchajwf</a></p>'
                ].join('')
            });
        }
    }
});
