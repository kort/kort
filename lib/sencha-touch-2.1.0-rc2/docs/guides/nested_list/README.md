# Using Nested List in Sencha Touch 2

{@link Ext.NestedList Nested List} is a component in Sencha Touch which provides a miller column interface to navigate between nested sets of data with a clean and easy to use interface.

    @example miniphone preview
    Ext.define('ListItem', {
        extend: 'Ext.data.Model',
        config: {
            fields: ['text']
        }
    });

    var treeStore = Ext.create('Ext.data.TreeStore', {
        model: 'ListItem',
        defaultRootProperty: 'items',
        root: {
            items: [
                {
                    text: 'Drinks',
                    items: [
                        {
                            text: 'Water',
                            items: [
                                { text: 'Still', leaf: true },
                                { text: 'Sparkling', leaf: true }
                            ]
                        },
                        { text: 'Soda', leaf: true }
                    ]
                },
                {
                    text: 'Snacks',
                    items: [
                        { text: 'Nuts', leaf: true },
                        { text: 'Pretzels', leaf: true },
                        { text: 'Wasabi Peas', leaf: true  }
                    ]
                }
            ]
        }
    });

    Ext.create('Ext.NestedList', {
        fullscreen: true,
        store: treeStore
    });

## Creating a simple Nested List

Creating a simple {@link Ext.NestedList Nested List} is fairly simple. There are only a few important configurations:

* {@link Ext.NestedList#store store} - this is the data store which is where the {@link Ext.NestedList Nested List} gets its data. {@link Ext.NestedList Nested List} uses the {@link Ext.data.TreeStore} class as {@link Ext.NestedList Nested List} has a tree-like UI.
* {@link Ext.NestedList#displayField displayField} - this is the field of the {@link Ext.NestedList#store store} which will be displayed on each list item in the {@link Ext.NestedList Nested List}. This configuration defaults to `text` so in some cases it is not needed.

Lets look at the at the code needed to create a basic {@link Ext.NestedList nested list}:

    @example miniphone
    Ext.define('ListItem', {
        extend: 'Ext.data.Model',
        config: {
            fields: ['text']
        }
    });

    var treeStore = Ext.create('Ext.data.TreeStore', {
        model: 'ListItem',
        defaultRootProperty: 'items',
        root: {
            items: [
                {
                    text: 'Drinks',
                    items: [
                        {
                            text: 'Water',
                            items: [
                                { text: 'Still', leaf: true },
                                { text: 'Sparkling', leaf: true }
                            ]
                        },
                        { text: 'Soda', leaf: true }
                    ]
                },
                {
                    text: 'Snacks',
                    items: [
                        { text: 'Nuts', leaf: true },
                        { text: 'Pretzels', leaf: true },
                        { text: 'Wasabi Peas', leaf: true  }
                    ]
                }
            ]
        }
    });

    Ext.create('Ext.NestedList', {
        fullscreen: true,
        store: treeStore
    });

**Lets walk through the code:**

* First we define our `ListItem` model. This is a simple {@link Ext.data.Model model} with 1 field defined which is our `text` field. This is the only information we need at this point, and it will be displayed in the list for each item.
* Next we create our `treeStore`.
* The first property we pass is the {@link Ext.data.Model model} instance was just defined.
* Then we define the {@link Ext.data.TreeStore#defaultRootProperty defaultRootProperty}` of the data that will be passed into our treeStore. In our case, this will be `items`.
* Then we define the {@link Ext.data.TreeStore#root root} property. This is the data that will be passed into the treeStore.

### Tree Store Data

The most confusing part of the above example is definitely the {@link Ext.data.TreeStore TreeStore} and its {@link Ext.data.TreeStore#root root/data}. Lets look at the code again:

    var treeStore = Ext.create('Ext.data.TreeStore', {
        model: 'ListItem',
        defaultRootProperty: 'items',
        root: {
            items: [
                {
                    text: 'Drinks',
                    items: [
                        {
                            text: 'Water',
                            items: [
                                { text: 'Still', leaf: true },
                                { text: 'Sparkling', leaf: true }
                            ]
                        },
                        { text: 'Soda', leaf: true }
                    ]
                },
                {
                    text: 'Snacks',
                    items: [
                        { text: 'Nuts', leaf: true },
                        { text: 'Pretzels', leaf: true },
                        { text: 'Wasabi Peas', leaf: true  }
                    ]
                }
            ]
        }
    });

So the first two lines are easy to understand. First we create an instance of a {@link Ext.data.TreeStore TreeStore} and then we give it a model which we defined above. Simple.

{@link Ext.data.TreeStore#defaultRootProperty defaultRootProperty} is where it starts to get a little bit trickier. It is the root field of your data which tells the {@link Ext.NestedList nested list} where the data starts. This is the same whether it is inline JavaScript (like above) or remote data (which we will come to later). This properly also applies to each item in your data, even if it is nested.

The {@link Ext.data.TreeStore#root root} property is this case is the data for this {@link Ext.data.TreeStore store}. As you can see it is an object, and it only has one property which is `items` - which is also our `defaultRootProperty`. Now within each item, we specify a `text` property which we also defined in our `ListItem` model above. As you can see the **Drinks**, **Water** and **Snacks** items also have children (using the `defaultRootProperty` `items`).

Some of the items also have a `leaf` property. This means that when a user taps on this item, a {@link Ext.NestedList#detailCard detail card} will appear (if configured) - but we will leave that until later.

## Loading Remote Data

In the above example we simply add some inline data, but when creating real world examples this is very rarely the case. What if we want to load data from a remote JSON file?

It is actually very similar. Lets look at the JSON file we want to load:

    {
        "items": [
            {
                "text": "Drinks",
                "items": [
                    {
                        "text": "Water",
                        "items": [
                            { "text": "Still", "leaf": true },
                            { "text": "Sparkling", "leaf": true }
                        ]
                    },
                    { "text": "Soda", "leaf": true }
                ]
            },
            {
                "text": "Snacks",
                "items": [
                    { "text": "Nuts", "leaf": true },
                    { "text": "Pretzels", "leaf": true },
                    { "text": "Wasabi Peas", "leaf": true  }
                ]
            }
        ]
    }

As you can see, it is identical to the inline {@link Ext.data.TreeStore#root root} properly we defined above. So lets look at what is different when we create the {@link Ext.data.TreeStore TreeStore}:

    var treeStore = Ext.create('Ext.data.TreeStore', {
        model: 'ListItem',
        defaultRootProperty: 'items',
        proxy: {
            type: 'ajax',
            url: 'data.json'
        }
    });

We create the store using {@link Ext.ClassManager#create Ext.create} and then we set the `model` and `defaultRootProperty` properties just like before, but then, this time, we set a `proxy`. This property tells the {@link Ext.data.TreeStore TreeStore} to load its data using a specify proxy. In this case we give it a `type` of 'ajax' (because it is loading a remote file) and then `url` of where the JSON file is. Simple.

## Detail Cards

A {@link Ext.NestedList#detailCard detail card} is what shows (if configured) if a user taps on an item that is a `leaf` (defined in the data the {@link Ext.data.TreeStore TreeStore} loads - example above). It can be any type of {@link Ext.Component Component}, which means it is very customizable. You can set the detail card using the {@link Ext.NestedList#detailCard detailCard} config in the nested list configuration. Lets look a simple example:

    @example miniphone preview
    Ext.define('ListItem', {
        extend: 'Ext.data.Model',
        config: {
            fields: ['text']
        }
    });

    var treeStore = Ext.create('Ext.data.TreeStore', {
        model: 'ListItem',
        defaultRootProperty: 'items',
        root: {
            items: [
                {
                    text: 'Drinks',
                    items: [
                        {
                            text: 'Water',
                            items: [
                                { text: 'Still', leaf: true },
                                { text: 'Sparkling', leaf: true }
                            ]
                        },
                        { text: 'Soda', leaf: true }
                    ]
                },
                {
                    text: 'Snacks',
                    items: [
                        { text: 'Nuts', leaf: true },
                        { text: 'Pretzels', leaf: true },
                        { text: 'Wasabi Peas', leaf: true  }
                    ]
                }
            ]
        }
    });

    Ext.create('Ext.NestedList', {
        fullscreen: true,
        store: treeStore,
        detailCard: {
            html: 'You are viewing the detail card!'
        }
    });

As you can see, when you tap on one of the `leaf` items, the {@link Ext.NestedList#detailCard detail card} is visible. So lets look at the code:

    Ext.create('Ext.NestedList', {
        fullscreen: true,
        store: treeStore,
        detailCard: {
            html: 'You are viewing the detail card!'
        }
    });

We simply set the {@link Ext.NestedList#detailCard detailCard} to be an object, with a config of {@link Ext.Component#html html} set. This object will automatically be transformed into a {@link Ext.Component Component} (just like when you call {@link Ext.Container#method-add add} on a {@link Ext.Container Container}).

What if we want to set the data in the {@link Ext.NestedList#detailCard detailCard} depending on what item we tap? Lets look at how we do that:

    Ext.create('Ext.NestedList', {
        fullscreen: true,
        store: treeStore,
        detailCard: {
            html: 'You are viewing the detail card!'
        },
        listeners: {
            leafitemtap: function(nestedList, list, index, target, record) {
                var detailCard = nestedList.getDetailCard();
                detailCard.setHtml('You selected: ' + record.get('text'));
            }
        }
    });

Look how we added the {@link Ext.NestedList#listeners listeners} config. We do this because we want to listen to the **{@link Ext.NestedList#event-leafitemtap leafitemtap}** event, which is called when any leaf item is tapped.

When that event is fired, it is passed a number of arguments:

* `nestedList` - this is a reference to the {@link Ext.NestedList nested list} instance.
* `list` - this is a reference to the last {@link Ext.dataview.List list}, where the item with the `leaf` config was tapped.
* `index` - the index of the {@link Ext.data.Model record} in the {@link Ext.dataview.List list} {@link Ext.dataview.List#store store}.
* `target` - the {@link Ext.dom.Element element} which was tapped.
* `record` - the {@link Ext.data.Model record} of the item which was tapped.

Now that we know when someone taps a `leaf` item, and we know which `record` was tapped, we can update the {@link Ext.NestedList#detailCard detail card} with some data.

To get the {@link Ext.NestedList#detailCard detailCard}, we can use the {@link Ext.NestedList#getDetailCard} method, and then with that we can update the {@link Ext.Component#html html} config of our {@link Ext.NestedList#detailCard detailCard}.

Lets look at an example of this working:

    @example miniphone preview
    Ext.define('ListItem', {
        extend: 'Ext.data.Model',
        config: {
            fields: ['text']
        }
    });

    var treeStore = Ext.create('Ext.data.TreeStore', {
        model: 'ListItem',
        defaultRootProperty: 'items',
        root: {
            items: [
                {
                    text: 'Drinks',
                    items: [
                        {
                            text: 'Water',
                            items: [
                                { text: 'Still', leaf: true },
                                { text: 'Sparkling', leaf: true }
                            ]
                        },
                        { text: 'Soda', leaf: true }
                    ]
                },
                {
                    text: 'Snacks',
                    items: [
                        { text: 'Nuts', leaf: true },
                        { text: 'Pretzels', leaf: true },
                        { text: 'Wasabi Peas', leaf: true  }
                    ]
                }
            ]
        }
    });

    Ext.create('Ext.NestedList', {
        fullscreen: true,
        store: treeStore,
        detailCard: {
            html: 'You are viewing the detail card!'
        },
        listeners: {
            leafitemtap: function(nestedList, list, index, target, record) {
                var detailCard = nestedList.getDetailCard();
                detailCard.setHtml('You selected: ' + record.get('text'));
            }
        }
    });

## Detail Container

Nested List has a {@link Ext.NestedList#detailContainer detailContainer} configuration which is used to specify the container of the {@link Ext.NestedList#detailCard detailCard}. This is used when you want the {@link Ext.NestedList#detailCard detailCard} to be in another container, which is often the case when the screen size is bigger than a normal phone.

Lets look at an example of this in action:

    @example preview
    Ext.define('ListItem', {
        extend: 'Ext.data.Model',
        config: {
            fields: ['text']
        }
    });

    var treeStore = Ext.create('Ext.data.TreeStore', {
        model: 'ListItem',
        defaultRootProperty: 'items',
        root: {
            items: [
                {
                    text: 'Drinks',
                    items: [
                        {
                            text: 'Water',
                            items: [
                                { text: 'Still', leaf: true },
                                { text: 'Sparkling', leaf: true }
                            ]
                        },
                        { text: 'Soda', leaf: true }
                    ]
                },
                {
                    text: 'Snacks',
                    items: [
                        { text: 'Nuts', leaf: true },
                        { text: 'Pretzels', leaf: true },
                        { text: 'Wasabi Peas', leaf: true  }
                    ]
                }
            ]
        }
    });

    var detailContainer = Ext.create('Ext.Container', {
        layout: 'card',
        flex: 1
    });

    var nestedList = Ext.create('Ext.NestedList', {
        store: treeStore,
        detailContainer: detailContainer,
        detailCard: true,
        listeners: {
            leafitemtap: function(nestedList, list, index, target, record) {
                var detailCard = nestedList.getDetailCard();
                detailCard.setHtml('You selected: ' + record.get('text'));
            }
        },
        flex: 1
    });

    Ext.Viewport.add({
        layout: 'hbox',
        items: [
            nestedList,
            detailContainer
        ]
    });

As you can see, we have 2 items in the Viewport now.

- The {@link Ext.NestedList nested list}.
- A new container which we specify as the {@link Ext.NestedList#detailContainer detailContainer}.

Setting the configuration is very simple. You just give it a reference to the container you want to use as the {@link Ext.NestedList#detailContainer detail container}:

    var detailContainer = Ext.create('Ext.Container', {
        layout: 'card'
    });

    var nestedList = Ext.create('Ext.NestedList', {
        store: treeStore,
        detailCard: true,
        detailContainer: detailContainer
    });

If you do not specify a {@link Ext.NestedList#detailContainer detailContainer}, the {@link Ext.NestedList#detailCard detailCard} will be added into the {@link Ext.NestedList nested list}.
