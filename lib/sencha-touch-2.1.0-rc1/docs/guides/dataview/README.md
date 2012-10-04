# Using DataViews in Sencha Touch 2

{@link Ext.dataview.DataView DataView} makes it easy to create lots of components dynamically, usually based off a {@link Ext.data.Store Store}.
It's great for rendering lots of data from your server backend or any other data source and is what powers
components like {@link Ext.List}.

Use {@link Ext.dataview.DataView DataView} whenever you want to show sets of the same component many times, for examples in apps like these:

* List of messages in an email app
* Showing latest news/tweets
* Tiled set of albums in an HTML5 music player

## Creating a Simple DataView

At its simplest, a {@link Ext.dataview.DataView DataView} is just a {@link Ext.data.Store Store} full of data and a simple template that we use to render each item:

    @example
    var touchTeam = Ext.create('Ext.DataView', {
        fullscreen: true,

        store: {
            fields: ['name', 'age'],
            data: [
                {name: 'Jamie Avins',  age: 100},
                {name: 'Rob Dougan',   age: 21},
                {name: 'Tommy Maintz', age: 24},
                {name: 'Jacky Nguyen', age: 24},
                {name: 'Ed Spencer',   age: 26}
            ]
        },

        itemTpl: '{name} is {age} years old'
    });

Here we just defined everything inline so it's all local with nothing being loaded from a server. For each of the 5
data items defined in our {@link Ext.data.Store Store}, {@link Ext.dataview.DataView DataView} will render a {@link Ext.Component Component} and pass in the name and age
data. The component will use the {@link Ext.dataview.DataView#itemTpl tpl} we provided above, rendering the data in the curly bracket placeholders we
provided.

Because {@link Ext.dataview.DataView DataView} is integrated with {@link Ext.data.Store Store}, any changes to the {@link Ext.data.Store Store} are immediately reflected on the screen. For
example, if we add a new record to the {@link Ext.data.Store Store} it will be rendered into our {@link Ext.dataview.DataView DataView}:

    touchTeam.getStore().add({
        name: 'Abe Elias',
        age: 33
    });

We didn't have to manually update the {@link Ext.dataview.DataView DataView}, it's just automatically updated. The same happens if we modify one
of the existing records in the {@link Ext.data.Store Store}:

    touchTeam.getStore().getAt(0).set('age', 42);

This will get the first record in the {@link Ext.data.Store Store} (Jamie), change the age to 42 and automatically update what's on the
screen.

## Loading data from a server

We often want to load data from our server or some other web service so that we don't have to hard code it all
locally. Let's say we want to load all of the latest tweets about Sencha Touch into a {@link Ext.dataview.DataView DataView}, and for each one
render the user's profile picture, user name and tweet message. To do this all we have to do is modify the
{@link Ext.dataview.DataView#store store} and {@link Ext.dataview.DataView#itemTpl itemTpl} a little:

    @example
    Ext.create('Ext.DataView', {
        fullscreen: true,

        store: {
            autoLoad: true,
            fields: ['from_user', 'text', 'profile_image_url'],

            proxy: {
                type: 'jsonp',
                url: 'http://search.twitter.com/search.json?q=Sencha Touch',

                reader: {
                    type: 'json',
                    rootProperty: 'results'
                }
            }
        },

        itemTpl: '<img src="{profile_image_url}" /><h2>{from_user}</h2><p>{text}</p>'
    });

The {@link Ext.dataview.DataView DataView} no longer has hard coded data, instead we've provided a {@link Ext.data.proxy.Proxy Proxy}, which fetches
the data for us. In this case we used a JSON-P proxy so that we can load from Twitter's JSON-P search API. We also
specified the fields present for each tweet, and used Store's {@link Ext.data.Store#autoLoad autoLoad} configuration
to load automatically. Finally, we configured a Reader to decode the response from Twitter, telling it to expect
JSON and that the tweets can be found in the 'results' part of the JSON response.

The last thing we did is update our template to render the image, twitter username and message. All we need to do
now is add a little CSS to style the list the way we want it...

## Styling a DataView

You may have realized by now that although our {@link Ext.dataview.DataView DataView} is displaying data from our {@link Ext.data.Store Store}, it doesn't have any default styling. This is by design, but adding custom CSS is very simple. {@link Ext.dataview.DataView DataView} has two configurations so you can target your custom CSS to your view: {@link Ext.dataview.DataView#baseCls baseCls} and {@link Ext.dataview.DataView#itemCls itemCls}. {@link Ext.dataview.DataView#baseCls baseCls} is used to add a `className` around the outer element of the {@link Ext.dataview.DataView DataView}. The {@link Ext.dataview.DataView#itemCls itemCls} you provide is added onto each item that is rendered into our {@link Ext.dataview.DataView DataView}.

If you do *not* specify a {@link Ext.dataview.DataView#itemCls itemCls}, it will automatically take the {@link Ext.dataview.DataView#baseCls baseCls} configuration (which defaults to `x-dataview`) and prepend `-item`. So each item would have a className of `x-dataview-item`.

But we before we add that configuration, we need to create our custom CSS. Here is a simple example below:

    .my-dataview-item {
        background: #ddd;
        padding: 1em;
        border-bottom: 1px solid #ccc;
    }
    .my-dataview-item img {
        float: left;
        margin-right: 1em;
    }
    .my-dataview-item h2 {
        font-weight: bold;
    }

Once we have that complete, we can go back to our previous Twitter example and add the {@link Ext.dataview.DataView#baseCls baseCls} configuration:

    @example
    Ext.create('Ext.DataView', {
        fullscreen: true,

        store: {
            autoLoad: true,
            fields: ['from_user', 'text', 'profile_image_url'],

            proxy: {
                type: 'jsonp',
                url: 'http://search.twitter.com/search.json?q=Sencha Touch',

                reader: {
                    type: 'json',
                    root: 'results'
                }
            }
        },

        itemTpl: '<img src="{profile_image_url}" /><h2>{from_user}</h2><p>{text}</p>',

        baseCls: 'my-dataview'

        //As described above, we don't need to set itemCls in most cases as it will already add a className
        //generated from the baseCls to each item.
        //itemCls: 'my-dataview-item'
    });

## Component DataView

Above we created our {@link Ext.dataview.DataView DataView} with an {@link Ext.dataview.DataView#itemTpl itemTpl}, which means each item is rendered from a {@link Ext.XTemplate template}. However, sometimes you need each item to be a component so you can provide a rich UI for your users. In Sencha Touch 2, we introduced the {@link Ext.dataview.DataView#useComponents useComponents} configuration which allows you to do just that.

Creating a component {@link Ext.dataview.DataView DataView} is very similar to creating a normal template based {@link Ext.dataview.DataView DataView} like above, however you must define the item view used when rendering each item in your list.

    Ext.define('MyListItem', {
        extend: 'Ext.dataview.component.DataItem',
        requires: ['Ext.Button'],
        xtype: 'mylistitem',

        config: {
            nameButton: true,

            dataMap: {
                getNameButton: {
                    setText: 'name'
                }
            }
        },

        applyNameButton: function(config) {
            return Ext.factory(config, Ext.Button, this.getNameButton());
        },

        updateNameButton: function(newNameButton, oldNameButton) {
            if (oldNameButton) {
                this.remove(oldNameButton);
            }

            if (newNameButton) {
                this.add(newNameButton);
            }
        }
    });

Above is an example of how to define your component based {@link Ext.dataview.DataView DataView} item component. There are a few important notes about this:

* We must extend {@link Ext.dataview.component.DataItem} for each item. This is an abstract class which handles the record handling for each item.
* Below the extend we require {@link Ext.Button}. This is simply because we are going to insert a {@link Ext.Button button} inside our item component.
* We then specify the `xtype` for this item component.
* Inside our config block we define `nameButton`. This is a custom configuration we add to this component which will be transformed into a {@link Ext.Button button} by the [class system](#!/guide/class_system). We set it to `true` by default, but this could also be a configuration block. This configuration will automatically generate getters and setters for our `nameButton`.
* Next we define the {@link Ext.dataview.component.DataItem#dataMap dataMap}. The dataMap is a map between the data of a {@link Ext.data.Model record} and this view. The `getNameButton` is the getter for the instance you want to update; so in this case we want to get the `nameButton` configuration of this component. Then inside that block we give it the setter for that instance; in this case being `setText` and give it the field of the record we are passing. So, once this item component gets a record it will get the `nameButton` and then call `setText` with the `name` value of the record.
* Then we define the apply method for our `nameButton`. The apply method uses {@link Ext#factory} to transform the configuration passed into an instance of {@link Ext.Button}. That instance is then returned, which will then cause `updateNameButton` to be called. The `updateNameButton` method simply removes the old nameButton instance if it exists, and adds the new nameButton instance if it exists.

Now we have created the item component, we can create our component {@link Ext.dataview.DataView DataView}, similar to how we done it before.

    Ext.create('Ext.DataView', {
        fullscreen: true,

        store: {
            fields: ['name', 'age'],
            data: [
                {name: 'Jamie Avins',  age: 100},
                {name: 'Rob Dougan',   age: 21},
                {name: 'Tommy Maintz', age: 24},
                {name: 'Jacky Nguyen', age: 24},
                {name: 'Ed Spencer',   age: 26}
            ]
        },

        useComponents: true,
        defaultType: 'mylistitem'
    });

There are two key additions. Firstly, we add the {@link Ext.dataview.DataView#useComponents useComponents} configuration and set it to `true`. Secondly, we set the {@link Ext.dataview.DataView#defaultType defaultType} configuration to our item component `mylistitem`. This tells the {@link Ext.dataview.DataView DataView} to use our defined item component as the view for each item.

Now if we run this code together, we can see the component {@link Ext.dataview.DataView DataView} in action.

    @example preview
    Ext.define('MyListItem', {
        extend: 'Ext.dataview.component.DataItem',
        requires: ['Ext.Button'],
        xtype: 'mylistitem',

        config: {
            nameButton: true,

            dataMap: {
                getNameButton: {
                    setText: 'name'
                }
            }
        },

        applyNameButton: function(config) {
            return Ext.factory(config, Ext.Button, this.getNameButton());
        },

        updateNameButton: function(newNameButton, oldNameButton) {
            if (oldNameButton) {
                this.remove(oldNameButton);
            }

            if (newNameButton) {
                this.add(newNameButton);
            }
        }
    });

    Ext.create('Ext.DataView', {
        fullscreen: true,

        store: {
            fields: ['name', 'age'],
            data: [
                {name: 'Jamie Avins',  age: 100},
                {name: 'Rob Dougan',   age: 21},
                {name: 'Tommy Maintz', age: 24},
                {name: 'Jacky Nguyen', age: 24},
                {name: 'Ed Spencer',   age: 26}
            ]
        },

        useComponents: true,
        defaultType: 'mylistitem'
    });

The great thing about this is the flexibility it can add to your dataviews. Each item component has access to its own {@link Ext.dataview.component.DataItem#record record}, so you can do just about anything with it.

Below we add a event listener to the tap event on our `nameButton`, which will then alert the user with the age of the selected person.

    Ext.define('MyListItem', {
        //...

        updateNameButton: function(newNameButton, oldNameButton) {
            if (oldNameButton) {
                this.remove(oldNameButton);
            }

            if (newNameButton) {
                // add an event listeners for the `tap` event onto the new button, and tell it to call the onNameButtonTap method
                // when it happens
                newNameButton.on('tap', this.onNameButtonTap, this);

                this.add(newNameButton);
            }
        },

        onNameButtonTap: function(button, e) {
            var record = this.getRecord();

            Ext.Msg.alert(
                record.get('name'), // the title of the alert
                "The age of this person is: " + record.get('age') // the message of the alert
            );
        }
    });

And when we add this code to our above example, we get the finished result:

    @example preview
    Ext.define('MyListItem', {
        extend: 'Ext.dataview.component.DataItem',
        requires: ['Ext.Button'],
        xtype: 'mylistitem',

        config: {
            nameButton: true,

            dataMap: {
                getNameButton: {
                    setText: 'name'
                }
            }
        },

        applyNameButton: function(config) {
            return Ext.factory(config, Ext.Button, this.getNameButton());
        },

        updateNameButton: function(newNameButton, oldNameButton) {
            if (oldNameButton) {
                this.remove(oldNameButton);
            }

            if (newNameButton) {
                // add an event listeners for the `tap` event onto the new button, and tell it to call the onNameButtonTap method
                // when it happens
                newNameButton.on('tap', this.onNameButtonTap, this);

                this.add(newNameButton);
            }
        },

        onNameButtonTap: function(button, e) {
            var record = this.getRecord();

            Ext.Msg.alert(
                record.get('name'), // the title of the alert
                "The age of this person is: " + record.get('age') // the message of the alert
            );
        }
    });

    Ext.create('Ext.DataView', {
        fullscreen: true,

        store: {
            fields: ['name', 'age'],
            data: [
                {name: 'Jamie Avins',  age: 100},
                {name: 'Rob Dougan',   age: 21},
                {name: 'Tommy Maintz', age: 24},
                {name: 'Jacky Nguyen', age: 24},
                {name: 'Ed Spencer',   age: 26}
            ]
        },

        useComponents: true,
        defaultType: 'mylistitem'
    });
