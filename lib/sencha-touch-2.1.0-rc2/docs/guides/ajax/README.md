# AJAX with Sencha Touch 2

Sencha Touch 2 provides a variety of convenient ways to get data into and out of your application. All of the data-bound
Components like Lists, Nested Lists and DataViews use Stores, which are easily configured to fetch and save data to a
large variety of sources. We'll look at managing data with stores later on but first let's start with how to issue
simple AJAX requests.

## Simple Requests with Ext.Ajax

AJAX requests are usually made to urls on the same domain as your application. For example, if your application is found
at http://myapp.com, you can send AJAX requests to urls like http://myapp.com/login.php and
http://myapp.com/products/1.json but not to other domains like http://google.com. This is because of browser security
restrictions, but Sencha Touch does provide some alternatives to get around this, which we'll look at shortly
(Cross-Domain Requests and JSON-P).

For now, here's how we can make an AJAX request to load data form a url on our domain:

    Ext.Ajax.request({
        url: 'myUrl',
        callback: function(options, success, response) {
            console.log(response.responseText);
        }
    });

Assuming your app is on http://myapp.com, this is going to send a GET request to http://myapp.com/myUrl. AJAX calls are
asynchronous so once the response comes back, our callback function is called with the response. All we're doing above
is logging the contents of the response to the console when the request has finished. Pretty simple so far, let's see
what else we can do.

### AJAX Options

Ext.Ajax takes a wide variety of options, including setting the method (GET, POST, PUT or DELETE), sending headers and
setting params to be sent in the url. First let's see how to set the method so we send a POST request instead of GET:

    Ext.Ajax.request({
        url: 'myUrl',
        method: 'POST',

        callback: function(options, success, response) {
            console.log(response.responseText);
        }
    });

Sending parameters is also easy:

    Ext.Ajax.request({
        url: 'myUrl',

        params: {
            username: 'Ed',
            password: 'not a good place to put a password'
        },

        callback: function(options, success, response) {
            console.log(response.responseText);
        }
    });

When we set params like this, the request is automatically sent as a POST with the params object sent as form data. The
request above is just like submitting a form with username and password fields.

If we wanted to send this as a GET request instead we can specify the method again, in which case our params are
automatically escaped and appended to the url for us:

    Ext.Ajax.request({
        url: 'myUrl',
        method: 'GET',

        params: {
            username: 'Ed',
            password: 'bad place for a password'
        },

        callback: function(options, success, response) {
            console.log(response.responseText);
        }
    });

Which sends a request to:

    http://mywebsite.com/myUrl?_dc=1329443875411&username=Ed&password=bad%20place%20for%20a%20password

You may have noticed that our last request created a url that contained "_dc=1329443875411". When you make a GET request
like this, many web servers will cache the response and send you back the same thing every time you make the request.
This speeds the web up, but is not always what you want. In fact in applications it's rarely what you want, so we "bust"
the cache for you by adding a timestamp to every request. This tells the web server to treat it is a fresh, uncached
request.

If you want to turn this behavior off, we can just set disableCaching to false:

    Ext.Ajax.request({
        url: 'myUrl',
        method: 'GET',
        disableCaching: false,

        params: {
            username: 'Ed',
            password: 'bad place for a password'
        },

        callback: function(options, success, response) {
            console.log(response.responseText);
        }
    });

Now our request no longer contains the cache busting string, and looks more like this:

    http://mywebsite.com/myUrl?username=Ed&password=bad%20place%20for%20a%20password

### Sending Headers

The final option we'll look at when it comes to customizing the request itself is the headers option. This enables you
to send any custom headers you want to your server, which is often useful when the web server returns different content
based on those headers. For example, if your web server returns JSON, XML or CSV based on which header it is passed, we
can ask it for JSON like this:

    Ext.Ajax.request({
        url: 'myUrl',

        headers: {
            "Content-Type": "application/json"
        },

        callback: function(options, success, response) {
            console.log(response.responseText);
        }
    });

If you create a request like this and inspect it in Firebug/web inspector you'll see that the Content-Type header has
been set to application/json. Your web server can pick up on this and send you the right response. You can pass any
number of headers you like into the headers option.

### Callback Options

Not every AJAX request succeeds. Sometimes the server is down, or your internet connection drops, or something else bad
happens. Ext.Ajax allows you to specify separate callbacks for each of these cases:

    Ext.Ajax.request({
        url: 'myUrl',

        success: function(response) {
            console.log("Spiffing, everything worked");
        },

        failure: function(response) {
            console.log("Curses, something terrible happened");
        }
    });

These do exactly what you'd expect them to do, and hopefully most of the time it is your success callback that gets
called. It's pretty common to provide a success callback that updates the UI or does whatever else is needed by the
application flow, and a failure handler that either retries the request or alerts the user that something went wrong.

You can provide *success*/*failure* and *callback* at the same time, so for this request if everything was ok our
*success* function is called first, followed by the main *callback* function, otherwise it'll be *failure* followed
by *callback*:

    Ext.Ajax.request({
        url: 'myUrl',

        success: function(response) {
            console.log("Spiffing, everything worked");
        },

        failure: function(response) {
            console.log("Curses, something terrible happened");
        },

        callback: function(options, success, response) {
            console.log("It is what it is");
        }
    });

### Timeouts and Aborting Requests

Another way requests can fail is if the server took too long to respond and the request timed out. In this case your
*failure* function will be called, and the request object it is passed will have timedout true:

    Ext.Ajax.request({
        url: 'myUrl',

        failure: function(response) {
            console.log(response.timedout); // logs true
        }
    });

By default the timeout threshold is 30 seconds, but you can specify it per request by setting the timeout in
millisecond. In this case our request will give up after 5 seconds:

    Ext.Ajax.request({
        url: 'myUrl',
        timeout: 5000,

        failure: function(response) {
            console.log(response.timedout); // logs true
        }
    });

It's also possible to abort requests that are currently outstanding. To do this you need to save a reference to the
request object that Ext.Ajax.request gives you:

    var myRequest = Ext.Ajax.request({
        url: 'myUrl',

        failure: function(response) {
            console.log(response.aborted); // logs true
        }
    });

    Ext.Ajax.abort(myRequest);

This time our failure callback is called and its response.aborted property is set. We can use all of the error handling
above in our apps:

    Ext.Ajax.request({
        url: 'myUrl',

        failure: function(response) {
            if (response.timedout) {
                Ext.Msg.alert('Timeout', "The server timed out :(");
            } else if (response.aborted) {
                Ext.Msg.alert('Aborted', "Looks like you aborted the request");
            } else {
                Ext.Msg.alert('Bad', "Something went wrong with your request");
            }
        }
    });

## Cross-Domain Requests

A relatively new capability of modern browsers is called <a href="http://www.w3.org/TR/cors/">CORS</a>, which stands
for Cross-Origin Resource Sharing. This allows you to send requests to other domains without the usual security
restrictions enforced by the browser. Sencha Touch 2 has support for CORS, though you'll probably need to do a little
setup on your web server to enable it. If you're not familiar with what you need to do on your web server to enable
CORS, a quick google search should give you plenty of answers.

Assuming your server is set up though, sending a CORS request is easy:

    Ext.Ajax.request({
        url: 'http://www.somedomain.com/some/awesome/url.php',
        withCredentials: true,
        useDefaultXhrHeader: false
    });

## Form Uploads

The final thing we'll cover is uploading forms. This is also really easy:

    Ext.Ajax.request({
        url: 'myUrl',
        form: 'myFormId',

        callback: function(options, success, response) {
            if (success) {
                Ext.Msg.alert('Success', 'We got your form submission');
            } else {
                Ext.Msg.alert('Fail', 'Hmm, that did not work');
            }
        }
    });

This finds a &lt;form&gt; tag on the page with id="myFormId", grabs its data and puts it into the request params object
just like at the start of this guide. Then it submits it to the url you specified and calls your callbacks like normal.
