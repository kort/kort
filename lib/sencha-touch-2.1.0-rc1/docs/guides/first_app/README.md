# Building your First App

## Preparation

This guide builds on the <a href="#!/guide/getting_started">Getting Started Guide</a>, which quickly gets you set up with the SDK and ensures your environment is fully functional. If you haven't been through this yet we suggest reading that guide first (it only takes a few minutes), then come back here to create your first app.

## What we're going to build

Today we're going to build a simple mobile website-like app that could be used for your company's mobile site. We'll add a home page, a contact form and a simple list to fetch our recent blog posts and allow our visitor to read them right there on the phone.

This is what we're going to build (it's interactive, try it yourself):

    @example raw portrait preview
    Ext.application({
        name: 'Sencha',

        launch: function() {
            //The whole app UI lives in this tab panel
            Ext.Viewport.add({
                xtype: 'tabpanel',
                fullscreen: true,
                tabBarPosition: 'bottom',

                items: [
                    // This is the home page, just some simple html
                    {
                        title: 'Home',
                        iconCls: 'home',
                        cls: 'home',
                        html: [
                            '<img height=260 src="http://staging.sencha.com/img/sencha.png" />',
                            '<h1>Welcome to Sencha Touch</h1>',
                            "<p>Building the Getting Started app</p>",
                            '<h2>Sencha Touch (2.0.0)</h2>'
                        ].join("")
                    },

                    // This is the recent blogs page. It uses a tree store to load its data from blog.json
                    {
                        xtype: 'nestedlist',
                        title: 'Blog',
                        iconCls: 'star',
                        cls: 'blog',
                        displayField: 'title',

                        store: {
                            type: 'tree',

                            fields: ['title', 'link', 'author', 'contentSnippet', 'content', {
                                name: 'leaf',
                                defaultValue: true
                            }],

                            root: {
                                leaf: false
                            },

                            proxy: {
                                type: 'jsonp',
                                url: 'https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&q=http://feeds.feedburner.com/SenchaBlog',
                                reader: {
                                    type: 'json',
                                    rootProperty: 'responseData.feed.entries'
                                }
                            }
                        },

                        detailCard: {
                            xtype: 'panel',
                            scrollable: true,
                            styleHtmlContent: true
                        },

                        listeners: {
                            itemtap: function(nestedList, list, index, element, post) {
                                this.getDetailCard().setHtml(post.get('content'));
                            }
                        }
                    },

                    // This is the contact page, which features a form and a button. The button submits the form
                    {
                        xtype: 'formpanel',
                        title: 'Contact Us',
                        iconCls: 'user',
                        url: 'contact.php',
                        layout: 'vbox',

                        items: [
                            {
                                xtype: 'fieldset',
                                title: 'Contact Us',
                                instructions: 'Email address is optional',

                                items: [
                                    {
                                        xtype: 'textfield',
                                        label: 'Name',
                                        name: 'name'
                                    },
                                    {
                                        xtype: 'emailfield',
                                        label: 'Email',
                                        name: 'email'
                                    },
                                    {
                                        xtype: 'textareafield',
                                        label: 'Message',
                                        name: 'message',
                                        height: 90
                                    }
                                ]
                            },
                            {
                                xtype: 'button',
                                text: 'Send',
                                ui: 'confirm',

                                // The handler is called when the button is tapped
                                handler: function() {

                                    // This looks up the items stack above, getting a reference to the first form it see
                                    var form = this.up('formpanel');

                                    // Sends an AJAX request with the form data to the url specified above (contact.php).
                                    // The success callback is called if we get a non-error response from the server
                                    form.submit({
                                        success: function() {
                                            // The callback function is run when the user taps the 'ok' button
                                            Ext.Msg.alert('Thank You', 'Your message has been received', function() {
                                                form.reset();
                                            });
                                        }
                                    });
                                }
                            }
                        ]
                    }
                ]
            });
        }
    });
    

## Getting Started

The first thing we need to do is set up our application, just like we did in the <a href="#!/guide/getting_started">Getting Started Guide</a>. The app is using a {@link Ext.tab.Panel tab panel} that will hold the 4 pages so we'll start with that:

    @example raw miniphone
    Ext.application({
        name: 'Sencha',

        launch: function() {
            Ext.create("Ext.tab.Panel", {
                fullscreen: true,
                items: [
                    {
                        title: 'Home',
                        iconCls: 'home',
                        html: 'Welcome'
                    }
                ]
            });
        }
    });

If you run this in the browser (click the Preview button), a {@link Ext.tab.Panel TabPanel} should appear on top of the screen. The home page could be a bit more welcoming, so let's add some content to it and reposition the tab bar at the bottom of the page. We do that with the {@link Ext.tab.Panel#tabBarPosition tabBarPosition} config and by adding a bit of HTML:

    @example raw portrait
    Ext.application({
        name: 'Sencha',

        launch: function() {
            Ext.create("Ext.tab.Panel", {
                fullscreen: true,
                tabBarPosition: 'bottom',

                items: [
                    {
                        title: 'Home',
                        iconCls: 'home',
                        html: [
                            '<img src="http://staging.sencha.com/img/sencha.png" />',
                            '<h1>Welcome to Sencha Touch</h1>',
                            "<p>You're creating the Getting Started app. This demonstrates how ",
                            "to use tabs, lists and forms to create a simple app</p>",
                            '<h2>Sencha Touch (2.0.0)</h2>'
                        ].join("")
                    }
                ]
            });
        }
    });

Click the Preview button next to the example to have a look: you should see some HTML content but it won't look very good. We'll add a {@link Ext.Component#cls cls} config and add it to the panel, adding a CSS class that we can target to make things look better. All of the CSS we're adding is in the examples/getting_started/index.html file in the SDK download. Here's how our home page looks now:

    @example raw preview portrait
    Ext.application({
        name: 'Sencha',

        launch: function() {
            Ext.create("Ext.tab.Panel", {
                fullscreen: true,
                tabBarPosition: 'bottom',

                items: [
                    {
                        title: 'Home',
                        iconCls: 'home',
                        cls: 'home',

                        html: [
                            '<img src="http://staging.sencha.com/img/sencha.png" />',
                            '<h1>Welcome to Sencha Touch</h1>',
                            "<p>You're creating the Getting Started app. This demonstrates how ",
                            "to use tabs, lists and forms to create a simple app</p>",
                            '<h2>Sencha Touch 2</h2>'
                        ].join("")
                    }
                ]
            });
        }
    });

## Adding The Blogs Page

Now that we have a decent looking home page, it's time to move on to the next screen. In order to keep the code for each page easy to follow we're just going to create one tab at a time and then combine them all together again at the end.

For now, we'll remove the first tab and replace it with a List. We're going to be using Google's <a href="https://developers.google.com/feed/v1/reference">Feed API service</a> to fetch the feeds. There's a bit more code involved this time so first let's take a look at the result, then we can see how it's accomplished:

    @example raw portrait preview
    Ext.application({
        name: 'Sencha',

        launch: function() {
            Ext.create("Ext.tab.Panel", {
                fullscreen: true,
                tabBarPosition: 'bottom',

                items: [
                    {
                        xtype: 'nestedlist',
                        title: 'Blog',
                        iconCls: 'star',
                        displayField: 'title',

                        store: {
                            type: 'tree',

                            fields: [
                                'title', 'link', 'author', 'contentSnippet', 'content',
                                {name: 'leaf', defaultValue: true}
                            ],

                            root: {
                                leaf: false
                            },

                            proxy: {
                                type: 'jsonp',
                                url: 'https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&q=http://feeds.feedburner.com/SenchaBlog',
                                reader: {
                                    type: 'json',
                                    rootProperty: 'responseData.feed.entries'
                                }
                            }
                        },

                        detailCard: {
                            xtype: 'panel',
                            scrollable: true,
                            styleHtmlContent: true
                        },

                        listeners: {
                            itemtap: function(nestedList, list, index, element, post) {
                                this.getDetailCard().setHtml(post.get('content'));
                            }
                        }
                    }
                ]
            });
        }
    });

You can click the 'Code Editor' button above the example to see the full code, but we'll go over it piece by piece. Instead of a panel we're using a {@link Ext.dataview.NestedList nestedlist} this time, fetching the most recent blog posts from sencha.com/blog. We're using Nested List so that we can drill down into the blog entry itself by simply tapping on the list.

Let's break down the code above, starting with just the list itself:

    @example raw portrait
    Ext.application({
        name: 'Sencha',

        launch: function() {
            Ext.create("Ext.tab.Panel", {
                fullscreen: true,
                tabBarPosition: 'bottom',

                items: [
                    {
                        xtype: 'nestedlist',
                        title: 'Blog',
                        iconCls: 'star',
                        displayField: 'title',

                        store: {
                            type: 'tree',

                            fields: [
                                'title', 'link', 'author', 'contentSnippet', 'content',
                                {name: 'leaf', defaultValue: true}
                            ],

                            root: {
                                leaf: false
                            },

                            proxy: {
                                type: 'jsonp',
                                url: 'https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&q=http://feeds.feedburner.com/SenchaBlog',
                                reader: {
                                    type: 'json',
                                    rootProperty: 'responseData.feed.entries'
                                }
                            }
                        }
                    }
                ]
            });
        }
    });

We're giving the Nested List a few simple configurations - title, iconCls and displayField - and a more detailed one called {@link Ext.dataview.NestedList#store store}. The Store config tells the nested list how to fetch its data. Let's go over each store config in turn:

* *type: tree* creates a {@link Ext.data.TreeStore tree store}, which NestedList uses
* *fields* tells the Store what fields we're expecting in the blog data (title, content, author etc)
* *proxy* tells the Store where to fetch its data from. We'll examine this more closely in a moment
* *root* tells the root node it is not a leaf. Above we'd set the leaf defaultValue to true so we need to override that for the root

Of all the Store configurations, proxy is doing the most work. We're telling the proxy to use Google's <a href="https://developers.google.com/feed/v1/reference">Feed API service</a> to return our blog data in JSON-P format. This allows us to easily grab feed data from any blog and view it in our app (for example try swapping the Sencha blog url for http://rss.slashdot.org/Slashdot/slashdot above to see it fetch Slashdot's feed).

The last part of the proxy definition was a Reader. The reader is what decodes the response from Google into useful data. When Google sends us back the blog data, they nest it inside a JSON object that looks a bit like this:

    {
        responseData: {
            feed: {
                entries: [
                    {author: 'Bob', title: 'Great Post', content: 'Really good content...'}
                ]
            }
        }
    }

The bit we care about is the entries array, so we just set our Reader's {@link Ext.data.reader.Json#rootProperty rootProperty} to 'responseData.feed.entries' and let the framework do the rest.

### Digging In

Now that we have our nested list fetching and showing data, the last thing we need to do is to allow the user to tap on an entry to read it. We're just going to add two more configurations to our Nested List to finish this off:

    {
        xtype: 'nestedlist',
        //all other configurations as above
        
        detailCard: {
            xtype: 'panel',
            scrollable: true,
            styleHtmlContent: true
        },

        listeners: {
            itemtap: function(nestedList, list, index, element, post) {
                this.getDetailCard().setHtml(post.get('content'));
            }
        }
    }

Here we've just set up a {@link Ext.dataview.NestedList#detailCard detailCard}, which is a useful feature of Nested List that allows you to show a different view when a user taps on an item. We've configured our detailCard to be a scrollable {@link Ext.Panel Panel} that uses {@link Ext.Panel#styleHtmlContent styleHtmlContent} to make the text look good.

The final piece of the puzzle is adding an {@link Ext.dataview.NestedList#itemtap itemtap} listener, which just calls our function whenever an item is tapped on. All our function does is set the detailCard's HTML to the content of the post you just tapped on and the framework takes care of the rest, animating the detail card into view to make the post appear. This was the only line of code we had to write to make the blog reader work.

## Creating a Contact Form

The final thing we're going to do for our app is create a contact form. We're just going to take the user's name, email address and a message, and use a {@link Ext.form.FieldSet FieldSet} to make it look good. The code for this one is simple:

    @example raw portrait
    Ext.application({
        name: 'Sencha',

        launch: function() {
            Ext.create("Ext.tab.Panel", {
                fullscreen: true,
                tabBarPosition: 'bottom',

                items: [
                    {
                        title: 'Contact',
                        iconCls: 'user',
                        xtype: 'formpanel',
                        url: 'contact.php',
                        layout: 'vbox',

                        items: [
                            {
                                xtype: 'fieldset',
                                title: 'Contact Us',
                                instructions: '(email address is optional)',
                                items: [
                                    {
                                        xtype: 'textfield',
                                        label: 'Name'
                                    },
                                    {
                                        xtype: 'emailfield',
                                        label: 'Email'
                                    },
                                    {
                                        xtype: 'textareafield',
                                        label: 'Message'
                                    }
                                ]
                            },
                            {
                                xtype: 'button',
                                text: 'Send',
                                ui: 'confirm',
                                handler: function() {
                                    this.up('formpanel').submit();
                                }
                            }
                        ]
                    }
                ]
            });
        }
    });

This time we're just creating a {@link Ext.form.Panel form} that contains a {@link Ext.form.FieldSet fieldset}. The fieldset contains three fields - one for name, one for email and one for a message. We've using a {@link Ext.layout.VBox VBox layout}, which just arranges the items vertically on the page one above the other.

At the bottom we have a {@link Ext.Button Button} with a tap {@link Ext.Button#handler handler}. This employs the useful {@link Ext.Container#up up} method, which returns the form panel that the button is inside of. We then just call {@link Ext.form.Panel#method-submit submit} to submit the form, which sends it to the url we specified above ('contact.php').

## Pulling it all together

Now that we've created each view individually it's time to bring them all together into our completed app. 

    @example raw preview portrait
    //We've added a third and final item to our tab panel - scroll down to see it
    Ext.application({
        name: 'Sencha',

        launch: function() {
            Ext.create("Ext.tab.Panel", {
                fullscreen: true,
                tabBarPosition: 'bottom',

                items: [
                    {
                        title: 'Home',
                        iconCls: 'home',
                        cls: 'home',
                        html: [
                            '<img width="65%" src="http://staging.sencha.com/img/sencha.png" />',
                            '<h1>Welcome to Sencha Touch</h1>',
                            "<p>You're creating the Getting Started app. This demonstrates how ",
                            "to use tabs, lists and forms to create a simple app</p>",
                            '<h2>Sencha Touch 2</h2>'
                        ].join("")
                    },
                    {
                        xtype: 'nestedlist',
                        title: 'Blog',
                        iconCls: 'star',
                        displayField: 'title',

                        store: {
                            type: 'tree',

                            fields: [
                                'title', 'link', 'author', 'contentSnippet', 'content',
                                {name: 'leaf', defaultValue: true}
                            ],

                            root: {
                                leaf: false
                            },

                            proxy: {
                                type: 'jsonp',
                                url: 'https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&q=http://feeds.feedburner.com/SenchaBlog',
                                reader: {
                                    type: 'json',
                                    rootProperty: 'responseData.feed.entries'
                                }
                            }
                        },

                        detailCard: {
                            xtype: 'panel',
                            scrollable: true,
                            styleHtmlContent: true
                        },

                        listeners: {
                            itemtap: function(nestedList, list, index, element, post) {
                                this.getDetailCard().setHtml(post.get('content'));
                            }
                        }
                    },
                    //this is the new item
                    {
                        title: 'Contact',
                        iconCls: 'user',
                        xtype: 'formpanel',
                        url: 'contact.php',
                        layout: 'vbox',

                        items: [
                            {
                                xtype: 'fieldset',
                                title: 'Contact Us',
                                instructions: '(email address is optional)',
                                items: [
                                    {
                                        xtype: 'textfield',
                                        label: 'Name'
                                    },
                                    {
                                        xtype: 'emailfield',
                                        label: 'Email'
                                    },
                                    {
                                        xtype: 'textareafield',
                                        label: 'Message'
                                    }
                                ]
                            },
                            {
                                xtype: 'button',
                                text: 'Send',
                                ui: 'confirm',
                                handler: function() {
                                    this.up('formpanel').submit();
                                }
                            }
                        ]
                    }
                ]
            });
        }
    });

You can find the full source code of the getting started app in the examples/getting_started folder of the Sencha Touch 2.0 SDK download.