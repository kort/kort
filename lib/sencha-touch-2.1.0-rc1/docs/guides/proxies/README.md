# Using Proxies

Proxies are used by stores to handle the loading and saving of model data. There are two types of proxy: client and
server. Examples of client proxies include Memory for storing data in the browser's memory and Local Storage which uses
the HTML 5 local storage feature when available. Server proxies handle the marshaling of data to some remote server and
examples include Ajax, JsonP, and Rest.

Proxies can be defined directly on a model, like so:

    Ext.define('User', {
        extend: 'Ext.data.Model',

        config: {
            fields: ['id', 'name', 'age', 'gender'],
            proxy: {
                type: 'rest',
                url : '/data/users.json',
                reader: {
                    type: 'json',
                    root: 'users'
                }
            }
        }
    });

    // Uses the User Model's Proxy
    Ext.create('Ext.data.Store', {
        model: 'User'
    });

This helps in two ways. First, it's likely that every store that uses the User model will need to load its data the same
way, so we avoid having to duplicate the proxy definition for each store. Second, we can now load and save model data
without a store:

    // Gives us a reference to the User class
    var User = Ext.ModelMgr.getModel('User');

    var ed = Ext.create('User', {
        name: 'Ed Spencer',
        age : 25
    });

    // We can save Ed directly without having to add him to a Store first because we
    // configured a RestProxy this will automatically send a POST request to the url /users
    ed.save({
        success: function(ed) {
            console.log("Saved Ed! His ID is "+ ed.getId());
        }
    });

    // Load User 1 and do something with it (performs a GET request to /users/1)
    User.load(1, {
        success: function(user) {
            console.log("Loaded user 1: " + user.get('name'));
        }
    });

There are also proxies that take advantage of the new capabilities of HTML5 - [LocalStorage](#/api/Ext.data.proxy.LocalStorage)
and [SessionStorage](#/api/Ext.data.proxy.SessionStorage). Although older browsers don't support these new HTML5 APIs,
they're so useful that a lot of applications will benefit enormously by using them.

[Example of a Model that uses a Proxy directly](guides/data/examples/model_with_proxy/index.html)
