# Using Components in Sencha Touch 2

## What is a Component?

Most of the visual classes you interact with in Sencha Touch are Components. Every Component in Sencha Touch is a subclass of Ext.Component, which means they can all:

* Render themselves onto the page using a template
* Show and hide themselves at any time
* Center themselves on the screen
* Enable and disable themselves

They can also do a few more advanced things:

* Float above other components (windows, message boxes and overlays)
* Change size and position on the screen with animation
* Dock other Components inside itself (useful for toolbars)
* Align to other components, allow themselves to be dragged around, make their content scrollable & more

## What is a Container?

Every Component you create has all of the abilities above, but applications are made up of lots of components, usually nested inside one another. Containers are just like Components, but in addition to the capabilities above they can also allow you to render and arrange child Components inside them. Most apps have a single top-level Container called a Viewport, which takes up the entire screen. Inside of this are child components, for example in a mail app the Viewport Container's two children might be a message List and an email preview pane.

Containers give the following extra functionality:

* Adding child Components at instantiation and run time
* Removing child Components
* Specifying a [Layout](#!/guide/layouts)

Layouts determine how the child Components should be laid out on the screen. In our mail app example we'd use an HBox layout so that we can pin the email list to the left hand edge of the screen and allow the preview pane to occupy the rest. There are several layouts in Sencha Touch 2, each of which help you achieve your desired application structure, further explained in the [Layout guide](#!/guide/layouts).

## Instantiating Components

Components are created the same way as all other classes in Sencha Touch - using Ext.create. Here's how we can create a Panel:

    var panel = Ext.create('Ext.Panel', {
        html: 'This is my panel'
    });

This will create a {@link Ext.Panel Panel} instance, configured with some basic HTML content. A Panel is just a simple Component that can render HTML and also contain other items. In this case we've created a Panel instance but it won't show up on the screen yet because items are not rendered immediately after being instantiated. This allows us to create some components and move them around before rendering and laying them out, which is a good deal faster than moving them after rendering.

To show this panel on the screen now we can simply add it to the global Viewport:

    Ext.Viewport.add(panel);

Panels are also Containers, which means they can contain other Components, arranged by a layout. Let's revisit the above example now, this time creating a panel with two child Components and a hbox layout:

    @example
    var panel = Ext.create('Ext.Panel', {
        layout: 'hbox',

        items: [
            {
                xtype: 'panel',
                flex: 1,
                html: 'Left Panel, 1/3rd of total size',
                style: 'background-color: #5E99CC;'
            },
            {
                xtype: 'panel',
                flex: 2,
                html: 'Right Panel, 2/3rds of total size',
                style: 'background-color: #759E60;'
            }
        ]
    });

    Ext.Viewport.add(panel);

This time we created 3 Panels - the first one is created just as before but the inner two are declared inline using an xtype. Xtype is a convenient way of creating Components without having to go through the process of using Ext.create and specifying the full class name, instead you can just provide the xtype for the class inside an object and the framework will create the components for you.

We also specified a layout for the top level panel - in this case hbox, which splits the horizontal width of the parent panel based on the 'flex' of each child. For example, if the parent Panel above is 300px wide then the first child will be flexed to 100px wide and the second to 200px because the first one was given flex: 1 and the second flex: 2.

## Configuring Components

Whenever you create a new Component you can pass in configuration options. All of the configurations for a given Component are listed in the "Config options" section of its class docs page. You can pass in any number of configuration options when you instantiate the Component, and modify any of them at any point later. For example, we can easily modify the {@link Ext.Panel#html html content} of a Panel after creating it:

    @example miniphone
    //we can configure the HTML when we instantiate the Component
    var panel = Ext.create('Ext.Panel', {
        fullscreen: true,
        html: 'This is a Panel'
    });

    //we can update the HTML later using the setHtml method:
    panel.setHtml('Some new HTML');

    //we can retrieve the current HTML using the getHtml method:
    Ext.Msg.alert(panel.getHtml()); //alerts "Some new HTML"

Every config has a getter method and a setter method - these are automatically generated and always follow the same pattern. For example, a config called 'html' will receive getHtml and setHtml methods, a config called defaultType will receive getDefaultType and setDefaultType methods, and so on.

## Using xtype

xtype is an easy way to create Components without using the full class name. This is especially useful when creating
a {@link Ext.Container Container} that contains child Components. An xtype is simply a shorthand way of specifying a
Component - for example you can use xtype: 'panel' instead of typing out Ext.panel.Panel.

Sample usage:

    @example miniphone
    Ext.create('Ext.Container', {
        fullscreen: true,
        layout: 'fit',

        items: [
            {
                xtype: 'panel',
                html: 'This panel is created by xtype'
            },
            {
                xtype: 'toolbar',
                title: 'So is the toolbar',
                docked: 'top'
            }
        ]
    });


### List of xtypes

This is the list of all xtypes available in Sencha Touch 2:

<pre>
xtype                   Class
-----------------       ---------------------
actionsheet             Ext.ActionSheet
audio                   Ext.Audio
button                  Ext.Button
component               Ext.Component
container               Ext.Container
image                   Ext.Img
label                   Ext.Label
loadmask                Ext.LoadMask
map                     Ext.Map
mask                    Ext.Mask
media                   Ext.Media
panel                   Ext.Panel
segmentedbutton         Ext.SegmentedButton
sheet                   Ext.Sheet
spacer                  Ext.Spacer
title                   Ext.Title
titlebar                Ext.TitleBar
toolbar                 Ext.Toolbar
video                   Ext.Video
carousel                Ext.carousel.Carousel
carouselindicator       Ext.carousel.Indicator
navigationview          Ext.navigation.View
datepicker              Ext.picker.Date
picker                  Ext.picker.Picker
pickerslot              Ext.picker.Slot
slider                  Ext.slider.Slider
thumb                   Ext.slider.Thumb
tabbar                  Ext.tab.Bar
tabpanel                Ext.tab.Panel
tab                     Ext.tab.Tab
viewport                Ext.viewport.Default

DataView Components
---------------------------------------------
dataview                Ext.dataview.DataView
list                    Ext.dataview.List
listitemheader          Ext.dataview.ListItemHeader
nestedlist              Ext.dataview.NestedList
dataitem                Ext.dataview.component.DataItem

Form Components
---------------------------------------------
checkboxfield           Ext.field.Checkbox
datepickerfield         Ext.field.DatePicker
emailfield              Ext.field.Email
field                   Ext.field.Field
hiddenfield             Ext.field.Hidden
input                   Ext.field.Input
numberfield             Ext.field.Number
passwordfield           Ext.field.Password
radiofield              Ext.field.Radio
searchfield             Ext.field.Search
selectfield             Ext.field.Select
sliderfield             Ext.field.Slider
spinnerfield            Ext.field.Spinner
textfield               Ext.field.Text
textareafield           Ext.field.TextArea
textareainput           Ext.field.TextAreaInput
togglefield             Ext.field.Toggle
urlfield                Ext.field.Url
fieldset                Ext.form.FieldSet
formpanel               Ext.form.Panel
</pre>

## Adding Components to Containers

As we mentioned above, Containers are special Components that can have child Components arranged by a Layout. One of the code samples above showed how to create a Panel with 2 child Panels already defined inside it but it's easy to do this at run time too:

	@example
    //this is the Panel we'll be adding below
    var aboutPanel = Ext.create('Ext.Panel', {
        html: 'About this app'
    });

    //this is the Panel we'll be adding to
    var mainPanel = Ext.create('Ext.Panel', {
        fullscreen: true,

        layout: 'hbox',
        defaults: {
            flex: 1
        },

        items: {
            html: 'First Panel',
			style: 'background-color: #5E99CC;'
        }
    });

    //now we add the first panel inside the second
    mainPanel.add(aboutPanel);

Here we created three Panels in total. First we made the aboutPanel, which we might use to tell the user a little about the app. Then we create one called mainPanel, which already contains a third Panel in its {@link Ext.Container#cfg-items items} configuration, with some dummy text ("First Panel"). Finally, we add the first panel to the second by calling the {@link Ext.Container#method-add add} method on mainPanel.

In this case we gave our mainPanel another hbox layout, but we also introduced some {@link Ext.Container#defaults defaults}. These are applied to every item in the Panel, so in this case every child inside mainPanel will be given a flex: 1 configuration. The effect of this is that when we first render the screen only a single child is present inside mainPanel, so that child takes up the full width available to it. Once the mainPanel.add line is called though, the aboutPanel is rendered inside of it and also given a flex of 1, which will cause it and the first panel to both receive half the full width of the mainPanel.

Likewise, it's easy to remove items from a Container:

    mainPanel.remove(aboutPanel);

After this line is run everything is back to how it was, with the first child panel once again taking up the full width inside mainPanel.

## Showing and Hiding Components

Every Component in Sencha Touch can be shown or hidden with a simple API. Continuing with the mainPanel example above, here's how we can hide it:

    mainPanel.hide();

This will hide the mainPanel itself and any child Components inside it. Showing the Component again is predictably easy:

    mainPanel.show();

Again, this will restore the visibility of mainPanel and any child Components inside it.

## Events

All Components fire events, which you can listen to and take action on. For example, whenever a {@link Ext.form.Text Text field} is typed into, its 'change' event is fired. You can listen to that event by simply passing a {@link Ext.Component#listeners listeners} config:

	Ext.create('Ext.form.Text', {
		label: 'Name',
		listeners: {
			change: function(field, newValue, oldValue) {
				myStore.filter('name', newValue);
			}
		}
	});

Every time the value of the text field changes, the 'change' event is fired and the function we provided called. In this case we filtered a {@link Ext.data.Store Store} by the name typed in to it, but we could have provided any other function there.

Lots of events are fired by Sencha Touch components, allowing you to easily hook into most aspects of an Application's behavior. They can also be specified after the Component has been created.

For example, let's say you have a dashboard that polls for live updates, but you don't want it to poll if the dashboard is not visible, you could simply hook into the dashboard's show and hide events:

	dashboard.on({
		hide: MyApp.stopPolling,
		show: MyApp.startPolling
	});

It's easy to hook behavior like this into your whole app, in this case preserving battery life. Other useful events that are fired are:

* {@link Ext.Component#event-show show}
* {@link Ext.Component#event-hide hide}

Each Component has a full list of the events they fire inside their class docs.

## Docking

Sencha Touch has the ability to dock Components within other Containers. For example we may be using an {@link Ext.layout.HBox hbox layout} and want to place a banner to the top - docking gives us an easy way to do this without having to nest Containers inside one another:

{@img ../layouts/docktop.jpg}

[The Layout Guide](#!/guide/layouts) has a full discussion of docking and all of the other layout options.

## Destroying Components

Because most mobile devices have a limited amount of memory is often a good idea to destroy Components when you know you won't need them any more. It's not the first thing you should be thinking of when you create an app, but it's a good way to optimize the experience your users get when you push the app into production. Destroying a Component is easy:

    mainPanel.destroy();

This will remove the mainPanel from the DOM and remove any event listeners it has set up on specific DOM elements. It will also destroy any instances that the Panel uses internally, and call destroy on all of its child components. After a Component is destroyed all of its children will also be gone, it will no longer be in the DOM and any references to it will no longer be valid.
