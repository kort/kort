/**
 * Jog With Friends - Sencha Touch app server side by Nick Poulden
 *
 * See a hosted example at http://ju.mp/senchajwf
 */

var graph = require('fbgraph'),
    _ = require('underscore'),
    crypto = require('crypto'),
    express = require('express'),
    connect = require('connect'),
    MongoStore = require('connect-mongo'),
    mongoose = require('mongoose');

var config = {

    // Base URL of the App (must be a publically accessible URL)
    redirect_uri:  'http://example.com',

    // Facebook Application ID
    client_id:     '123132123',

    // Facebook Application Secret
    client_secret: '413914e6f9fd896bd035fe18cd54bae0',

    // MongoDB endpoint
    mongoDb:       'mongodb://<user>:<pass>@ds029827.mongolab.com:29827/<database>',

    // Session encyption key
    sessionSecret: 'oasjdf0asduf0asd9f0adfks'
};





// Database and Model setup

mongoose.connect(config.mongoDb);

Run = mongoose.model('Run', new mongoose.Schema({
    location:  String,  // Location of the Run
    date:      Date,    // Date of the Run
    distance:  Number,  // Distance of the Run
    profileId: Number,  // Facebook profile ID
    name:      String   // First and last name of the User
}));



// App server setup

var app = express.createServer(

    connect.static(__dirname + '/public'),
    connect.cookieParser(),

    express.session({
        secret: config.sessionSecret,
        store: new MongoStore({ url: config.mongoDb })
    }),

    connect.bodyParser(),
    express.logger(),
    express.errorHandler({ dumpExceptions: true })
);

app.enable('jsonp callback');

var port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log("Listening on " + port);
});



/**
 * Routes requiring Facebook interactions will first be run through this function to ensure we
 * have an active access_token with which to make requests to Facebook.
 */
function checkFbSession(req, res, next) {

    // First we look for the cookie set by Facebook when a user logs in and authorises an app.
    // The format of the cookie name is 'fbsr_' followed by the Application ID
    var fbCookie = req.cookies['fbsr_' + config.client_id],
        parsedToken, base64data;

    // If there's no Facebook cookie, the user is not authorized, so we shouldn't proceed further.
    if (!fbCookie) {
        handleError('No Facebook cookie detected.', null, req, res);
        return;
    }

    // The cookie is the same format as a Facebook signed request:
    // https://developers.facebook.com/docs/authentication/signed_request/
    base64data = fbCookie.split('.', 2);
    parsedToken = JSON.parse(new Buffer(base64data[1], 'base64').toString('ascii'));

    // If we already have a Facebook session saved, and the User ID and Auth Code match those
    // that are in the Facebook cookie, we can assume we're successfully authenticated with
    // Facebook, and proceed to the next step in the route.
    //
    // We check the user ID and code are the same in case the user has logged out and in on the
    // client side (invalidating the server session) or if there is now a different user logged in
    // on the client side.
    if (req.session.fb && req.session.fb.user_id == parsedToken.user_id && req.session.fb.code == parsedToken.code) {
        graph.setAccessToken(req.session.fb.access_token);
        next();
    } else {

        // If we don't have a Facebook session saved locally, we'll need to swap the code in our
        // Facebook cookie for an access_token.
        console.log("Found Facebook cookie. Swapping Auth code for access_token...");

        // Save the Facebook user ID and auth code to the session so we can check they are valid
        // in subsequent requests.
        req.session.fb = {
            user_id: parsedToken.user_id,
            code: parsedToken.code
        };

        // Make the call to Facebook to swap our Auth token for an access_token
        graph.authorize({
            "redirect_uri":   "", // Facebook JS SDK sets redirect_uri to ''
            "client_id":      config.client_id,
            "client_secret":  config.client_secret,
            "code":           parsedToken.code
        }, function(err, facebookRes) {

            if (err) {
                handleError('Error obtaining Facebook access_token.', facebookRes, req, res);
                return;
            }

            console.log("Successfully obtained Facebook access_token.");

            // Save the access token to the session, and activate it for the current request.
            req.session.fb.access_token = facebookRes.access_token;
            graph.setAccessToken(facebookRes.access_token);
            next();
        });
    }
}



// URL Endpoints

var handleError = function(msg, err, req, res, next){
    if (req.session) {
        req.session.destroy();
    }
    console.log(msg, err);
    res.json({ success: false, error: err });
};

/**
 * Serve index.html if the root URL is hit
 */
app.get('/', function(req, res) {
    res.sendfile('./public/index.html');
});

/**
 * Return a list of runs for the user and all the user's friends
 */
app.get('/runs', checkFbSession, function(req, res) {

    console.log("Getting list of friends for " + req.session.fb.user_id + "...");

    // Get the list of friends for the logged in user
    graph.get("/me/friends", function(err, friends) {

        if (err) {
            handleError('Could not retrieve list of friends', friends, req, res);
            return;
        }

        console.log("Found " + friends.data.length + " friends. Searching for runs...");

        // Create an array of friend IDs
        var friendIds = _.map(friends.data, function(f) {
            return f.id;
        });

        // Add the users ID to the list
        friendIds.push(req.session.fb.user_id);

        // Search for all runs in the database with a profile ID in the friendIds array
        Run.where('profileId').in(friendIds).sort('date', -1).run(function(err, runs) {

            if (err) {
                handleError('Could not retrieve list of runs', runs, req, res);
                return;
            }

            console.log("Found " + runs.length + " runs.");

            // Send the list of runs back to the client
            res.json(runs);
        });
    });
});

/**
 * Add a new Run to the database
 */
app.post('/run', checkFbSession, function(req, res, next) {

    console.log("Saving new Run for " + req.session.fb.user_id + "...");

    // Retrieve the currently logged in user details from Facebook
    graph.get("/me", function(err, user) {

        if (err) {
            handleError('Could not retrieve user info', user, req, res);
            return;
        }

        // Construct a new Run using the post data
        var run = new Run({
            location:  req.body.location || 'Unknown Location',
            date:      new Date(),
            distance:  req.body.distance,
            profileId: user.id,
            name:      user.first_name + ' ' + user.last_name
        });

        // Save the run to the database
        run.save(function(err) {

            if (err) {
                handleError('Could not save run', err, req, res);
                return;
            }

            console.log("Successfully saved new run");
            res.json({ success: true });
        });
    });
});
