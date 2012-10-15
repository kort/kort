//<debug>
Ext.Loader.setPath({
    'Ext': '../../src'
});
//</debug>

/**
 * This example is a simple demo of some of the form and field components in Sencha Touch.
 * It also shows how you can bind a Model instance to a form, and then update that instance with values
 * from the form panel.
 */

/**
 * Here we define a User model. An instance of this model will be used to load data into our form
 * panel. We will also update this form panel when you press the submit button.
 */
Ext.define('User', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
            { name: 'name',     type: 'string' },
            { name: 'password', type: 'string' },
            { name: 'disabled', type: 'string' },
            { name: 'email',    type: 'string' },
            { name: 'bio',      type: 'string' },
            { name: 'url',      type: 'string' },
            { name: 'date',     type: 'date' },
            { name: 'number',   type: 'integer' },
            { name: 'height',   type: 'integer' },
            { name: 'enable',   type: 'integer' },
            { name: 'spinner',  type: 'integer' },
            { name: 'rank',     type: 'string' },
            { name: 'enable',   type: 'boolean' },
            { name: 'cool',     type: 'boolean' },
            { name: 'color',    type: 'string' },
            { name: 'team',     type: 'string' },
            { name: 'secret',   type: 'boolean' },
            { name: 'single_slider' },
            { name: 'multiple_slider' }
        ]
    }
});

// Define our simple application
Ext.application({
    // Setup the icons and startup screens for phones and tablets.
    startupImage: {
        '320x460': 'resources/startup/Default.jpg', // Non-retina iPhone, iPod touch, and all Android devices
        '640x920': 'resources/startup/640x920.png', // Retina iPhone and iPod touch
        '640x1096': 'resources/startup/640x1096.png', // iPhone 5 and iPod touch (fifth generation)
        '768x1004': 'resources/startup/768x1004.png', //  Non-retina iPad (first and second generation) in portrait orientation
        '748x1024': 'resources/startup/748x1024.png', //  Non-retina iPad (first and second generation) in landscape orientation
        '1536x2008': 'resources/startup/1536x2008.png', // : Retina iPad (third generation) in portrait orientation
        '1496x2048': 'resources/startup/1496x2048.png' // : Retina iPad (third generation) in landscape orientation
    },

    isIconPrecomposed: false,
    icon: {
        57: 'resources/icons/icon.png',
        72: 'resources/icons/icon@72.png',
        114: 'resources/icons/icon@2x.png',
        144: 'resources/icons/icon@144.png'
    },

    // Require the components we will be using in this example
    requires: [
        'Ext.form.*',
        'Ext.field.*',
        'Ext.Button',
        'Ext.Toolbar',

        'Ext.data.Store'
    ],

    /**
     * The launch method of our application gets called when the application is good to launch.
     * In here, we are going to build the structure of our application and add it into the Viewport.
     */
    launch: function() {
        // Get all the items for our form.
        var items = this.getFormItems(),
            config, form;

        // Create the configuration of our form.
        // We give it the `formpanel` xtype and give it the items we got above.
        config = {
            xtype: 'formpanel',
            items: items
        };

        // If we are on a phone, we just want to add the form into the viewport as is.
        // This will make it stretch to the size of the Viewport.
        if (Ext.os.deviceType == 'Phone') {
            form = Ext.Viewport.add(config);
        } else {
            // If we are not on a phone, we want to make the formpanel model and give it a fixed with and height.
            Ext.apply(config, {
                modal: true,
                height: 505,
                width: 480,
                centered: true,

                // Disable hideOnMaskTap so it cannot be hidden
                hideOnMaskTap: false
            });

            // Add it to the Viewport and show it.
            form = Ext.Viewport.add(config);
            form.show();
        }

        this.form = form;
    },

    /**
     * This method returns an array of all items we should add into the form panel we create above in our launch function.
     * We have created this function to simply make things cleaner and easier to read and understand. You could just put these items
     * inline up above in the form `config`.
     * @return {Array} items
     */
    getFormItems: function() {
        return [
            {
                xtype: 'fieldset',
                title: 'Personal Info',
                instructions: 'Please enter the information above.',
                defaults: {
                    required: true,
                    labelAlign: 'left',
                    labelWidth: '40%'
                },
                items: [
                    {
                        xtype: 'textfield',
                        name: 'name',
                        label: 'Name',
                        autoCapitalize: false
                    },
                    {
                        xtype: 'passwordfield',
                        name: 'password',
                        label: 'Password'
                    },
                    {
                        xtype: 'textfield',
                        name: 'disabled',
                        label: 'Disabled',
                        disabled: true
                    },
                    {
                        xtype: 'emailfield',
                        name: 'email',
                        label: 'Email',
                        placeHolder: 'you@sencha.com'
                    },
                    {
                        xtype: 'urlfield',
                        name: 'url',
                        label: 'Url',
                        placeHolder: 'http://sencha.com'
                    },
                    {
                        xtype: 'checkboxfield',
                        name: 'cool',
                        label: 'Cool',
                        value: true
                    },
                    {
                        xtype: 'spinnerfield',
                        name: 'spinner',
                        label: 'Spinner'
                    },
                    {
                        xtype: 'selectfield',
                        name: 'rank',
                        label: 'Rank',
                        valueField: 'rank',
                        displayField: 'title',
                        store: {
                            data: [
                                { rank: 'master', title: 'Master'},
                                { rank: 'padawan', title: 'Student'},
                                { rank: 'teacher', title: 'Instructor'},
                                { rank: 'aid', title: 'Assistant'}
                            ]
                        }
                    },
                    {
                        xtype: 'datepickerfield',
                        name: 'date',
                        label: 'Start Date',
                        value: new Date(),
                        picker: {
                            yearFrom: 1980
                        }
                    },
                    {
                        xtype: 'hiddenfield',
                        name: 'secret',
                        value: 'false'
                    },
                    {
                        xtype: 'textareafield',
                        name: 'bio',
                        label: 'Bio',
                        maxRows: 10
                    },
                    {
                        xtype: 'sliderfield',
                        name: 'height',
                        label: 'Height'
                    },
                    {
                        xtype: 'togglefield',
                        name: 'enable',
                        label: 'Security Mode'
                    },
                    {
                        xtype: 'radiofield',
                        name: 'team',
                        label: 'Red Team',
                        value: 'redteam'
                    },
                    {
                        xtype: 'radiofield',
                        name: 'team',
                        label: 'Blue Team',
                        value: 'blueteam'
                    }
                ]
            },
            {
                xtype: 'fieldset',
                title: 'Favorite color',
                defaults: { xtype: 'radiofield' },
                items: [
                    { name: 'color', label: 'Red', value: 'red' },
                    { name: 'color', label: 'Green', checked: true, value: 'green'}
                ]
            },
            {
                xtype: 'fieldset',
                title: 'HTML5',
                items: [
                    {
                        xtype: 'numberfield',
                        name: 'number',
                        label: 'Number'
                    },
                    {
                        xtype: 'emailfield',
                        name: 'email2',
                        label: 'Email',
                        clearIcon: true
                    },
                    {
                        xtype: 'urlfield',
                        name: 'url2',
                        label: 'URL',
                        clearIcon: true
                    }
                ]
            },
            {
                xtype: 'fieldset',
                title: 'Single Select',
                items: [
                    {
                        xtype: 'selectfield',
                        name: 'options',
                        options: [
                            {text: 'This is just a big select with text that is overflowing', value: '1'},
                            {text: 'Another item', value: '2'}
                        ]
                    }
                ]
            },
            {
                xtype: 'fieldset',
                title: 'Single Text',
                items: [
                    {
                        xtype: 'textfield',
                        name: 'single_text',
                        clearIcon: true
                    }
                ]
            },
            {
                xtype: 'fieldset',
                title: 'Single Toggle',
                items: [
                    {
                        xtype: 'togglefield',
                        name: 'single_toggle',
                        value: 1
                    }
                ]
            },
            {
                xtype: 'fieldset',
                title: 'Single Slider',
                items: [
                    {
                        xtype: 'sliderfield',
                        name: 'single_slider',
                        value: 60
                    }
                ]
            },
            {
                xtype: 'fieldset',
                title: 'Multiple Slider Thumbs',
                items: [
                    {
                        xtype: 'sliderfield',
                        name: 'multiple_slider',
                        values: [40, 90]
                    }
                ]
            },

            // Create a docked bottom toolbar which will contain buttons to trigger various functions in our formpanel.
            {
                xtype: 'toolbar',
                docked: 'bottom',
                items: [
                    // Lets add a load button which will load the formpanel with a User model
                    {
                        text: 'Load Model',
                        ui: 'round',
                        scope: this,
                        handler: function() {
                            var form = this.form;

                            // Check if we have already created a user model yet. if we haven't, then lets create one.
                            if (!form.user) {
                                // Create a date for the datepicker field
                                var date = new Date();
                                date.setMonth(4);
                                date.setYear(1989);
                                date.setDate(1);

                                // Create a new instance of the User model with a bunch of fake values.
                                form.user = Ext.create('User', {
                                    name:     'Akura',
                                    password: 'secret',
                                    email:    'saru@sencha.com',
                                    disabled: 'disabled',
                                    url:      'http://sencha.com',
                                    bio:      'Learned the hard way!',
                                    number:   20,
                                    height:   20,
                                    spinner:  5,
                                    enable:   1,
                                    cool:     true,
                                    date:     date,
                                    team:     'redteam',
                                    color:    'blue',
                                    rank:     'padawan',
                                    secret:    true,
                                    single_slider:   10,
                                    multiple_slider: [20, 40]
                                });
                            }

                            // Set the record of the form to the User record instance.
                            form.setRecord(form.user);
                        }
                    },

                    { xtype: 'spacer' },

                    // Here we add a reset button which will reset all fields within the form panel back to their original value
                    {
                        text: 'Reset',

                        // Ensure the scope is 'this' so we have access to the global 'form' instance
                        scope: this,
                        handler: function() {
                            // Call the form.reset method
                            this.form.reset();
                        }
                    },

                    // Finally we add a Save button which will mask the formpanel, and update the current record in the formpanel with
                    // the latest values from the formpanel.
                    {
                        text: 'Save',
                        ui: 'confirm',
                        scope: this,
                        handler: function() {
                            var form = this.form;

                            // Mask the form
                            form.setMasked({
                                xtype: 'loadmask',
                                message: 'Saving...'
                            });

                            // Put it inside a timeout so it feels like it is going to a server.
                            setTimeout(function() {
                                if (form.user) {
                                    // Call the updateRecord method of formpanel with the user record instance. This will update the user record
                                    // with the latest values.
                                    form.updateRecord(form.user, true);
                                }

                                // Unmask the formpanel
                                form.setMasked(false);
                            }, 1000);
                        }
                    }
                ]
            }
        ];
    }
});

