# Using Forms in Sencha Touch 2

Most apps that require user input will make use of forms. Forms in Sencha Touch are a wrapper around normal HTML5 forms, with additional options for validating and submitting data, plus an easy way to lay fields out in a pleasing visual style.

    @example preview
    var formPanel = Ext.create('Ext.form.Panel', {
        fullscreen: true,

        items: [{
            xtype: 'fieldset',
            items: [
                {
                    xtype: 'textfield',
                    name : 'name',
                    label: 'Name'
                },
                {
                    xtype: 'emailfield',
                    name : 'email',
                    label: 'Email'
                },
                {
                    xtype: 'passwordfield',
                    name : 'password',
                    label: 'Password'
                }
            ]
        }]
    });

    formPanel.add({
        xtype: 'toolbar',
        docked: 'bottom',
        layout: { pack: 'center' },
        items: [
            {
                xtype: 'button',
                text: 'Set Data',
                handler: function() {
                    formPanel.setValues({
                        name: 'Ed',
                        email: 'ed@sencha.com',
                        password: 'secret'
                    });
                }
            },
            {
                xtype: 'button',
                text: 'Get Data',
                handler: function() {
                    Ext.Msg.alert('Form Values', JSON.stringify(formPanel.getValues(), null, 2));
                }
            },
            {
                xtype: 'button',
                text: 'Clear Data',
                handler: function() {
                    formPanel.reset();
                }
            }
        ]
    });

## Creating a form

The Form panel presents a set of form fields and provides convenient ways to load and save data. Usually a form panel just contains the set of fields you want to display, ordered inside the items configuration like this:

    @example preview
    Ext.create('Ext.form.Panel', {
        fullscreen: true,

        items: [
            {
                xtype: 'textfield',
                name : 'name',
                label: 'Name'
            },
            {
                xtype: 'emailfield',
                name : 'email',
                label: 'Email'
            },
            {
                xtype: 'passwordfield',
                name : 'password',
                label: 'Password'
            }
        ]
    });

Here we just created a simple form panel which could be used as a registration form to sign up to your service. We added a plain {@link Ext.form.Text text field} for the user's Name, an {@link Ext.form.Email email field} and finally a {@link Ext.form.Password password field}. In each case we provided a {@link Ext.field.Field#name name} config on the field so that we can identify it later on when we load and save data on the form.

## Loading data

Using the form we created above, we can load data into it in a few different ways, the easiest is to use {@link Ext.form.Panel#setValues setValues}:

    form.setValues({
        name: 'Ed',
        email: 'ed@sencha.com',
        password: 'secret'
    });

It's also easy to load {@link Ext.data.Model Model} instances into a form - let's say we have a User model and want to load a particular instance into our form:

    Ext.define('MyApp.model.User', {
        extend: 'Ext.data.Model',
        config: {
            fields: ['name', 'email', 'password']
        }
    });

    var ed = Ext.create('MyApp.model.User', {
        name: 'Ed',
        email: 'ed@sencha.com',
        password: 'secret'
    });

    form.setRecord(ed);

## Retrieving form data

Getting data out of the form panel is simple and is usually achieve vai the {@link Ext.form.Panel#getValues getValues} method:

    var values = form.getValues();

    // values now looks like this:
    {
        name: 'Ed',
        email: 'ed@sencha.com',
        password: 'secret'
    }

It's also possible to listen to the change events on individual fields to get more timely notification of changes that the user is making. Here we expand on the example above with the User model, updating the model as soon as any of the fields are changed:

    var form = Ext.create('Ext.form.Panel', {
        listeners: {
            '> field': {
                change: function(field, newValue, oldValue) {
                    ed.set(field.getName(), newValue);
                }
            }
        },
        items: [
            // as before
        ]
    });

The above used a new capability of Touch 2.0, which enables you to specify listeners on child components of any container. In this case, we attached a listener to the {@link Ext.field.Text#change change} event of each form field that is a direct child of the form panel. Our listener gets the name of the field that fired the change event, and updates our {@link Ext.data.Model Model} instance with the new value. For example, changing the email field in the form will update the Model's email field.

## Submitting forms

There are a few ways to submit form data. In our example above we have a Model instance that we have updated, giving us the option to use the Model's {@link Ext.data.Model#save save} method to persist the changes back to our server, without using a traditional form submission. Alternatively, we can send a normal browser form submit using the {@link Ext.form.Panel#method-submit submit} method:

    form.submit({
        url: 'url/to/submit/to',
        method: 'POST',
        success: function() {
            alert('form submitted successfully!');
        }
    });

In this case we provided the url to submit the form to inside the submit call - alternatively you can just set the {@link Ext.form.Panel#url url} configuration when you create the form. We can specify other parameters (see {@link Ext.form.Panel#method-submit submit} for a full list), including callback functions for success and failure, which are called depending on whether or not the form submission was successful. These functions are usually used to take some action in your app after your data has been saved to the server side.
