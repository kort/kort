# Using Stores

<a href="#!/guide/models">Models</a> are typically used with a Store, which is basically a collection of model instances. Setting up a store and loading its data is simple:

    Ext.create('Ext.data.Store', {
        model: 'User',
        proxy: {
            type: 'ajax',
            url : 'users.json',
            reader: 'json'
        },
        autoLoad: true
    });

We configured our store to use an {@link Ext.data.proxy.Ajax Ajax Proxy}, providing the name of the URL from which to load data the {@link Ext.data.reader.Reader Reader} used to decode the data. In this case our server is returning JSON, so we've set up a {@link Ext.data.reader.Json Json Reader} to read the response.
The store auto-loads a set of User model instances from the URL `users.json`.  The `users.json` URL should return a JSON string that looks something like this:

    {
        success: true,
        users: [
            { id: 1, name: 'Ed' },
            { id: 2, name: 'Tommy' }
        ]
    }

For a live demo, see the [Simple Store](guides/data/examples/simple_store/index.html) example.

### Inline data

Stores can also load data inline. Internally, `Store` converts each of the objects we pass in as {@link Ext.data.Store#cfg-data data} into {@link Ext.data.Model Model} instances:

    Ext.create('Ext.data.Store', {
        model: 'User',
        data: [
            { firstName: 'Ed',    lastName: 'Spencer' },
            { firstName: 'Tommy', lastName: 'Maintz' },
            { firstName: 'Aaron', lastName: 'Conran' },
            { firstName: 'Jamie', lastName: 'Avins' }
        ]
    });

[Inline Data example](guides/data/examples/inline_data/index.html)

### Sorting and Grouping

Stores are able to perform sorting, filtering, and grouping locally, as well as to support remote sorting, filtering, and grouping:

    Ext.create('Ext.data.Store', {
        model: 'User',

        sorters: ['name', 'id'],
        filters: {
            property: 'name',
            value   : 'Ed'
        },
        groupField: 'age',
        groupDir: 'DESC'
    });

In the store we just created, the data will be sorted first by name then id; it will be filtered to only include users with the name `Ed`, and the data will be grouped by age in descending order. It's easy to change the sorting, filtering, and grouping at any time through the Store API.  For a live demo, see the [Sorting Grouping Filtering Store](guides/data/examples/sorting_grouping_filtering_store/index.html) example.
