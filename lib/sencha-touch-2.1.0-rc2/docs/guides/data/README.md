# Using the data package in Sencha Touch 2

The data package is responsible for loading and saving all data in a Sencha Touch app. Most of what you do with the data package has to do with models, stores, and proxies:

* **Model:** A model represents an entity your app cares about. User, Contact, Address, and Product could all be models. At its simplest, a model is just a collection of fields and their data, but they can do a lot more.
* **Store:** A store is just a collection of model instances. Mostly it's just a glorified array, but it also provides capabilities like sorting, filtering, and grouping, as well as firing useful events.
* **Proxy:** Proxies are responsible for all of the actual loading and saving of data. Usually you'll create an {@link Ext.data.proxy.Ajax AJAX proxy} which will fetch data from your server and populate it into a store.

Find out more about <a href="#!/guide/models">Models</a>, <a href="#!/guide/stores">Stores</a> and <a href="#!/guide/proxies">Proxies</a> in their individual guides.

## Further Reading

Data is just part of the Sencha Touch 2 ecosystem. To understand more about the framework and how it works, we recommend the following:

* [Components and Containers](#!/guide/components)
* [The Class System](#!/guide/class_system)
* [The Layout System](#!/guide/layouts)
* [Getting Started](#!/guide/getting_started)
