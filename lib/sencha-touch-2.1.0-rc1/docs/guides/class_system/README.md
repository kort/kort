# How to use classes in Sencha Touch 2

[Watch the Class System video from SenchaCon 2011](#!/video/class-system)

Sencha Touch 2 uses the state of the art class system developed for Ext JS 4. It makes it easy to create new classes in JavaScript, providing inheritance, dependency loading, mixins, powerful configuration options, and lots more.

At its simplest, a class is just an object with some functions and properties attached to it. For instance, here's a class for an animal, recording its name and a function that makes it speak:

    Ext.define('Animal', {
        config: {
            name: null
        },

        constructor: function(config) {
            this.initConfig(config);
        },

        speak: function() {
            alert('grunt');
        }
    });

We now have a class called `Animal`, where each animal can have a name and speak. To create a new instance of animal, we just use Ext.create:

    var bob = Ext.create('Animal', {
        name: 'Bob'
    });

    bob.speak(); //alerts 'grunt'

Here we created an Animal called Bob and commanded it to speak. Now that we've created a class and instantiated it, we can start improving what we have. At the moment we don't know Bob's species, so let's clear that up with a `Human` subclass:

    Ext.define('Human', {
        extend: 'Animal',

        speak: function() {
            alert(this.getName());
        }
    });

Now we've got a new class that inherits from Animal, therefore gaining all of its functions and configurations. We actually overrode the speak function because most humans are smart enough to say their name instead of grunt. Now, let's make Bob a human:

    var bob = Ext.create('Human', {
        name: 'Bob'
    });

    bob.speak(); //alerts 'Bob'

We used a magical function when adding the Human subclass. You'll notice that we didn't actually define a getName function on our Animal class, so where did it come from? Part of the class system is the ability to give classes configuration options, which each automatically give you the following:

* a getter function that returns the current value, in this case `getName()`.
* a setter function that sets a new value, in this case `setName()`.
* an applier function called by the setter that lets you run a function when a configuration changes, in this case `applyName()`.
* a updater funciton called by the setter than run when the value for a configuration changes, in this case `updateName()`.

The getter and setter functions are generated for free and are the recommended way to store data in a class. Every component in Sencha Touch uses the class system and the generated functions always follow the same pattern so if you know a config you already know how to get and set its value.

It also makes your code cleaner. For example, if you wanted to always ask the user if she really wants to change Bob's name, you can just define an `applyName` function that will automatically be called:

    Ext.define('Human', {
        extend: 'Animal',

        applyName: function(newName, oldName) {
            return confirm('Are you sure you want to change name to ' + newName + '?')? newName : oldName;
        }
    });

We're just using the browser's built in confirm function, which opens a dialog asking the user the question and offering "Yes" and "No" as answers. The applier functions allow you to cancel the name change if you return false. As it happens the confirm function will return either new or old name depending on whether the user clicks Yes or No.

If we make a new Bob and try to change his name, but then click No when prompted, his name won't change after all:

    var bob = Ext.create('Human', {
        name: 'Bob'
    });

    bob.setName('Fred'); //opens a confirm box, but we click No

    bob.speak(); //still alerts 'Bob'

The apply function is also a great place where you should *transform* your value. Remember whatever this returns with will be the new value for this configuration. A good example of this would be to prepend a title to the name:

    Ext.define('Human', {
        extend: 'Animal',

        applyName: function(newName, oldName) {
            return 'Mr. ' + newName;
        }
    });

The other config method is update. The update method (`updateName()` in this case) is only called when the value of the config **changes**. So in the following case, `updateName()` would *not* be called:

    var bob = Ext.create('Human', {
        name: 'Bob'
    });

    bob.setName('Bob'); // The name is the same, so update is not called

So when we use the update method, the config is changing. This should be the place where you update your component, or do whatever you need to do when the value of your config changes. In this example, we will show an `alert`:

    Ext.define('Human', {
        extend: 'Animal',

        updateName: function(newName, oldName) {
            alert('Name changed. New name is: ' + newName);
        }
    });

Bare in mind that the update and apply methods get called on component instantiation too, so in the following example, we would get 2 alerts:

    // creating this will cause the name config to update, therefor causing the alert
    var bob = Ext.create('Human', {
        name: 'Bob'
    });

    // changing it will cause the alert to show again
    bob.setName('Ed');

We've basically already learned the important parts of classes, as follows:

* All classes are defined using `Ext.define`, including your own classes
* Most classes extend other classes, using the `extend` syntax
* Classes are created using `Ext.create`, for example `Ext.create('SomeClass', {some: 'configuration'})`
* Always usine the `config` syntax to get automatic getters and setters and have a much cleaner codebase

At this point you can already go about creating classes in your app, but the class system takes care of a few more things that will be helpful to learn are a few other things the class system does.

## Dependencies and Dynamic Loading

Most of the time, classes depend on other classes. The Human class above depends on the Animal class because it extends it - we depend on Animal being present to be able to define Human. Sometimes you'll make use of other classes inside a class, so you need to guarantee that those classes are on the page. Do this with the `requires` syntax:

    Ext.define('Human', {
        extend: 'Animal',

        requires: 'Ext.MessageBox',

        speak: function() {
        	Ext.Msg.alert(this.getName(), "Speaks...");
		}
	});

When you create a class in this way, Sencha Touch checks to see if `Ext.MessageBox` is already loaded and if not, loads the required class file immediately with AJAX.

`Ext.MessageBox` itself may also have classes it depends on, which are then also loaded automatically in the background. Once all the required classes are loaded, the Human class is defined and you can start using `Ext.create` to instantiate people. This works well in development mode as it means you don't have to manage the loading of all your scripts yourself, but not as well in production because loading files one by one over an internet connection is rather slow.

In production, we really want to load just one JavaScript file, ideally containing only the classes that our application actually uses. This is really easy in Sencha Touch 2 using the JSBuilder tool, which analyzes your app and creates a single file build that contains all of your classes and only the framework classes your app actually uses. See the [Building guide](#!/guide/building) for details on how to use the JSBuilder.

Each approach has its own pros and cons, but can we have the good parts of both without the bad, too? The answer is yes, and we've implemented the solution in Sencha Touch 2.

## Naming Conventions

Using consistent naming conventions throughout your code base for classes, namespaces and filenames helps keep your code organized, structured, and readable.

### 1) Classes

Class names may only contain **alphanumeric** characters. Numbers are permitted but are discouraged in most cases, unless they belong to a technical term. Do not use underscores, hyphens, or any other nonalphanumeric character. For example:

  - `MyCompany.useful_util.Debug_Toolbar` is discouraged
  - `MyCompany.util.Base64` is acceptable

Class names should be grouped into packages where appropriate and properly namespaced using object property dot notation ( . ). At the minimum, there should be one unique top-level namespace followed by the class name. For example:

    MyCompany.data.CoolProxy
    MyCompany.Application

The top-level namespaces and the actual class names should be in CamelCase, everything else should be all lower-cased. For example:

    MyCompany.form.action.AutoLoad

Classes that are not distributed by Sencha should never use `Ext` as the top-level namespace.

Acronyms should also follow CamelCase convention, for example:

  - `Ext.data.JsonProxy` instead of `Ext.data.JSONProxy`
  - `MyCompany.util.HtmlParser` instead of `MyCompary.parser.HTMLParser`
  - `MyCompany.server.Http` instead of `MyCompany.server.HTTP`


### 2) Source Files

The names of the classes map directly to the file paths in which they are stored. As a result, there must only be one class per file. For example:

  - `Ext.mixin.Observable` is stored in `path/to/src/Ext/mixin/Observable.js`
  - `Ext.form.action.Submit` is stored in `path/to/src/Ext/form/action/Submit.js`
  - `MyCompany.chart.axis.Numeric` is stored in `path/to/src/MyCompany/chart/axis/Numeric.js`

`path/to/src` is the directory of your application's classes. All classes should stay under this common root and should be properly namespaced for the best development, maintenance, and deployment experience.

### 3) Methods and Variables

Similarly to class names, method and variable names may only contain **alphanumeric** characters. Numbers are permitted but are discouraged in most cases, unless they belong to a technical term. Do not use underscores, hyphens, or any other nonalphanumeric character.

Method and variable names should always use CamelCase. This also applies to acronyms.

Here are a few examples:

  - Acceptable method names:

        encodeUsingMd5()
        getHtml() instead of getHTML()
        getJsonResponse() instead of getJSONResponse()
        parseXmlContent() instead of parseXMLContent()

  - Acceptable variable names:

        var isGoodName
        var base64Encoder
        var xmlReader
        var httpServer

### 4) Properties

Class property names follow the same convention as method and variable names, except the case when they are static constants. Static class properties that are constants should be all upper-cased, for example:

  - `Ext.MessageBox.YES = "Yes"`
  - `Ext.MessageBox.NO  = "No"`
  - `MyCompany.alien.Math.PI = "4.13"`


## Working with classes in Sencha Touch 2.0

### 1. Declaration

#### 1.1. The Old Way

If you've developed with Sencha Touch 1.x, you are certainly familiar with `Ext.extend` to create a class:

    var MyPanel = Ext.extend(Object, {
        // ...
    });

This approach is easy to follow when creating a new class that inherits from another. Other than direct inheritance, however, there wasn't a fluent API for other aspects of class creation, such as configuration, statics, and mixins. We will be reviewing these items in detail shortly.

Let's take a look at another example:

    My.cool.Panel = Ext.extend(Ext.Panel, {
        // ...
    });

In this example we want to namespace our new class and make it extend from `Ext.Panel`. There are two concerns we need to address:

  1. `My.cool` needs to be an existing object before we can assign `Panel` as its property.
  2. `Ext.Panel` needs to exist/be loaded on the page before it can be referenced.

The first item is usually solved with `Ext.namespace` (aliased by `Ext.ns`). This method recursively traverses through the object/property tree and creates them if they don't exist yet. The boring part is you need to remember adding them above `Ext.extend` all the time, like this:

    Ext.ns('My.cool');
    My.cool.Panel = Ext.extend(Ext.Panel, {
        // ...
    });

The second issue, however, is not easy to address because `Ext.Panel` might depend on many other classes that it directly/indirectly inherits from, and in turn, these dependencies might depend on other classes to exist. For that reason, applications written before Sencha Touch 2 usually include the whole library in the form of `ext-all.js` even though they might only need a small portion of the framework.

#### 1.2. The New Way

Sencha Touch 2 eliminates all those drawbacks with just one single method you need to remember for class creation: `Ext.define`. Its basic syntax is as follows:

    Ext.define(className, members, onClassCreated);

Let's look at each part of this:

- `className` is the class name
- `members` is an object represents a collection of class members in key-value pairs
- `onClassCreated` is an optional function callback to be invoked when all dependencies of this class are ready, and the class itself is fully created. Due to the [new asynchronous nature](#) of class creation, this callback can be useful in many situations. These will be discussed further in [Section IV](#).

**Example**

    Ext.define('My.sample.Person', {
        name: 'Unknown',

        constructor: function(name) {
            if (name) {
                this.name = name;
            }
        },

        eat: function(foodType) {
            alert(this.name + " is eating: " + foodType);
        }
    });

    var aaron = Ext.create('My.sample.Person', 'Aaron');
    aaron.eat("Salad"); // alert("Aaron is eating: Salad");

Note we created a new instance of `My.sample.Person` using the `Ext.create()` method.  We could have used the `new` keyword (`new My.sample.Person()`). However it is recommended that you always use `Ext.create` since it allows you to take advantage of dynamic loading. For more info on dynamic loading see the [Getting Started guide](#/guide/getting_started)

### 2. Configuration

In Sencha Touch 2, we introduce a dedicated `config` property that is processed by the powerful `Ext.Class` preprocessors before the class is created. Features include:

 - Configurations are completely encapsulated from other class members.
 - Getter and setter, methods for every config property are automatically generated into the class prototype during class creation if the class does not have these methods already defined.
 - An `apply` method is also generated for every config property.  The auto-generated setter method calls the `apply` method internally before setting the value.  Override the `apply` method for a config property if you need to run custom logic before setting the value. If `apply` does not return a value then the setter will not set the value. For an example see `applyTitle` below.

Here's an example:

    Ext.define('My.own.WindowBottomBar', {});

    Ext.define('My.own.Window', {

        /** @readonly */
        isWindow: true,

        config: {
            title: 'Title Here',

            bottomBar: {
                enabled: true,
                height: 50,
                resizable: false
            }
        },

        constructor: function(config) {
            this.initConfig(config);
        },

        applyTitle: function(title) {
            if (!Ext.isString(title) || title.length === 0) {
                console.log('Error: Title must be a valid non-empty string');
            }
            else {
                return title;
            }
        },

        applyBottomBar: function(bottomBar) {
            if (bottomBar && bottomBar.enabled) {
                if (!this.bottomBar) {
                    return Ext.create('My.own.WindowBottomBar', bottomBar);
                }
                else {
                    this.bottomBar.setConfig(bottomBar);
                }
            }
        }
    });


And here's an example of how it can be used:

    var myWindow = Ext.create('My.own.Window', {
        title: 'Hello World',
        bottomBar: {
            height: 60
        }
    });

    console.log(myWindow.getTitle()); // logs "Hello World"

    myWindow.setTitle('Something New');
    console.log(myWindow.getTitle()); // logs "Something New"

    myWindow.setTitle(null); // logs "Error: Title must be a valid non-empty string"

    myWindow.setBottomBar({ height: 100 }); // Bottom bar's height is changed to 100


### 3. Statics

Static members can be defined using the `statics` config, as follows:

    Ext.define('Computer', {
        statics: {
            instanceCount: 0,
            factory: function(brand) {
                // 'this' in static methods refer to the class itself
                return new this({brand: brand});
            }
        },

        config: {
            brand: null
        },

        constructor: function(config) {
            this.initConfig(config);

            // the 'self' property of an instance refers to its class
            this.self.instanceCount ++;
        }
    });

    var dellComputer = Computer.factory('Dell');
    var appleComputer = Computer.factory('Mac');

    alert(appleComputer.getBrand()); // using the auto-generated getter to get the value of a config property. Alerts "Mac"

    alert(Computer.instanceCount); // Alerts "2"


## Error Handling and debugging

Sencha Touch 2 includes some useful features that will help you with debugging and error handling.

You can use `Ext.getDisplayName()` to get the display name of any method.  This is especially useful for throwing errors that have the class name and method name in their description, such as:

    throw new Error('['+ Ext.getDisplayName(arguments.callee) +'] Some message here');

When an error is thrown in any method of any class defined using `Ext.define()`, you should see the method and class names in the call stack if you are using a WebKit based browser (Chrome or Safari). For example, here is what it would look like in Chrome:

{@img call-stack.png}

## Further Reading

Classes are just part of the Sencha Touch 2 ecosystem. To understand more about the framework and how it works, we recommend the following:

* [Components and Containers](#!/guide/components)
* [The Data Package](#!/guide/data)
* [The Layout System](#!/guide/layouts)
* [Getting Started](#!/guide/getting_started)
