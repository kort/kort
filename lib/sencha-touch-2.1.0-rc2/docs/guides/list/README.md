# Using Lists in Sencha Touch 2

{@video vimeo 37212149}

Sencha Touch provides a list component which is ideal for presenting an index-style list of items. In this tutorial, we walk through setting up a basic list, and show how to add an index bar, and group items together under a marker. Also, you'll learn how to create a detail panel to reveal information about each item in the list.

This tutorial features the new NavigationView and MVC Support built into Sencha Touch 2.

View source code on GitHub: [http://github.com/senchalearn/Presidents](http://github.com/senchalearn/Presidents)

Live demo: [http://senchalearn.github.com/Presidents/](http://senchalearn.github.com/Presidents/)

## Guide

List is a component that renders a {@link Ext.data.Store Store} as a list of items on the page. It's a subclass of {@link Ext.dataview.DataView DataView}, which gives it most of its capabilities (see [DataView guide](#/guide/dataview)). List adds a few capabilities of its own though:

* Grouping of items, optional index bar, pinned headers
* Optional disclosure icons on each item
* Optional icons and labels for each item

## Creating a simple List

You can render a List simply with static items like this:

	Ext.create('Ext.List', {
		store: {
			fields: ['name'],
			data: [
				{name: 'Cowper'},
				{name: 'Everett'},
				{name: 'University'},
				{name: 'Forest'}
			]
		},

		itemTpl: '{name}'
	});

This will just render one {@link Ext.dataview.component.DataItem DataItem} for each item in the {@link Ext.data.Store Store}. You can also attach listeners to events on the List,

	Ext.create('Ext.List', {
		listeners: {
			select: function(view, record) {
				Ext.Msg.alert('Selected!', 'You selected ' + record.get('name'));
			}
		}

		// store and itemConfig as before
	});

### Preview

	@example preview
	Ext.create('Ext.List', {
		fullscreen: true,

		store: {
			fields: ['name'],
			data: [
				{name: 'Cowper'},
				{name: 'Everett'},
				{name: 'University'},
				{name: 'Forest'}
			]
		},

		itemTpl: '{name}',

		listeners: {
			select: function(view, record) {
				Ext.Msg.alert('Selected!', 'You selected ' + record.get('name'));
			}
		}
	});



