/**
 * Demonstrates a tabbed form panel. This uses a tab panel with 3 tabs - Basic, Sliders and Toolbars - each of which is
 * defined below.
 *
 * See this in action at http://dev.sencha.com/deploy/sencha-touch-2-b3/examples/kitchensink/index.html#demo/forms
 */
Ext.define('Kitchensink.view.Forms', {
    extend: 'Ext.tab.Panel',

    requires: [
        'Ext.form.Panel',
        'Ext.form.FieldSet',
        'Ext.field.Number',
        'Ext.field.Spinner',
        'Ext.field.Password',
        'Ext.field.Email',
        'Ext.field.Url',
        'Ext.field.DatePicker',
        'Ext.field.Select',
        'Ext.field.Hidden',
        'Ext.field.Radio',
        'Ext.field.Slider',
        'Ext.field.Toggle',
        'Ext.field.Search'
    ],

    config: {
        activeItem: 0,
        tabBar: {
            // docked: 'bottom',
            ui: 'neutral',
            layout: {
                pack: 'center'
            }
        },
        items: [
            {
                title: 'Basic',
                xtype: 'formpanel',
                id: 'basicform',
                items: [
                    {
                        xtype: 'fieldset',
                        title: 'Personal Info',
                        instructions: 'Please enter the information above.',
                        defaults: {
                            labelWidth: '35%'
                        },
                        items: [
                            {
                                xtype         : 'textfield',
                                name          : 'name',
                                label         : 'Name',
                                placeHolder   : 'Tom Roy',
                                autoCapitalize: true,
                                required      : true,
                                clearIcon     : true
                            },
                            {
                                xtype: 'passwordfield',
                                name : 'password',
                                label: 'Password'
                            },
                            {
                                xtype      : 'emailfield',
                                name       : 'email',
                                label      : 'Email',
                                placeHolder: 'me@sencha.com',
                                clearIcon  : true
                            },
                            {
                                xtype      : 'urlfield',
                                name       : 'url',
                                label      : 'Url',
                                placeHolder: 'http://sencha.com',
                                clearIcon  : true
                            },
                            {
                                xtype      : 'spinnerfield',
                                name       : 'spinner',
                                label      : 'Spinner',
                                minValue   : 0,
                                maxValue   : 10,
                                stepValue  : 1,
                                cycle      : true
                            },
                            {
                                xtype: 'checkboxfield',
                                name : 'cool',
                                label: 'Cool'
                            },
                            {
                                xtype: 'datepickerfield',
                                destroyPickerOnHide: true,
                                name : 'date',
                                label: 'Start Date',
                                value: new Date(),
                                picker: {
                                    yearFrom: 1990
                                }
                            },
                            {
                                xtype: 'selectfield',
                                name : 'rank',
                                label: 'Rank',
                                options: [
                                    {
                                        text : 'Master',
                                        value: 'master'
                                    },
                                    {
                                        text : 'Journeyman',
                                        value: 'journeyman'
                                    },
                                    {
                                        text : 'Apprentice',
                                        value: 'apprentice'
                                    }
                                ]
                            },
                            {
                                xtype: 'textareafield',
                                name : 'bio',
                                label: 'Bio'
                            }
                        ]
                    },
                    {
                        xtype: 'fieldset',
                        title: 'Favorite color',
                        defaults: {
                            xtype     : 'radiofield',
                            labelWidth: '35%'
                        },
                        items: [
                            {
                                name : 'color',
                                value: 'red',
                                label: 'Red'
                            },
                            {
                                name : 'color',
                                label: 'Blue',
                                value: 'blue'
                            },
                            {
                                name : 'color',
                                label: 'Green',
                                value: 'green'
                            },
                            {
                                name : 'color',
                                label: 'Purple',
                                value: 'purple'
                            }
                        ]
                    },
                    {
                        xtype: 'panel',
                        defaults: {
                            xtype: 'button',
                            style: 'margin: 0.1em',
                            flex : 1
                        },
                        layout: {
                            type: 'hbox'
                        },
                        items: [
                            {
                                text: 'Disable fields',
                                scope: this,
                                hasDisabled: false,
                                handler: function(btn){
                                    var form = Ext.getCmp('basicform');

                                    if (btn.hasDisabled) {
                                        form.enable();
                                        btn.hasDisabled = false;
                                        btn.setText('Disable fields');
                                    } else {
                                        form.disable();
                                        btn.hasDisabled = true;
                                        btn.setText('Enable fields');
                                    }
                                }
                            },
                            {
                                text: 'Reset',
                                handler: function(){
                                    Ext.getCmp('basicform').reset();
                                }
                            }
                        ]
                    }
                ]
            },

            {
                title: 'Sliders',
                xtype: 'formpanel',
                items: [
                    {
                        xtype: 'fieldset',
                        defaults: {
                            labelWidth: '35%',
                            labelAlign: 'top'
                        },
                        items: [
                            {
                                xtype: 'sliderfield',
                                name: 'thumb',
                                label: 'Single Thumb'
                            },
                            {
                                xtype: 'sliderfield',
                                name: 'multithumb',
                                label: 'Multiple Thumbs',
                                values: [10, 70]
                            },
                            {
                                xtype: 'togglefield',
                                name: 'toggle',
                                label: 'Toggle'
                            }
                        ]
                    }
                ]
            },

            {
                title: 'Toolbars',
                xtype: 'panel',
                items: [
                    {
                        styleHtmlContent: true
                    },
                    {
                        docked: 'top',
                        xtype: 'toolbar',
                        items: [
                            {
                                xtype      : 'searchfield',
                                placeHolder: 'Search',
                                name       : 'searchfield'
                            }
                        ]
                    },
                    {
                        docked: 'top',
                        ui: 'light',
                        xtype: 'toolbar',
                        items: [
                            {
                                xtype      : 'textfield',
                                placeHolder: 'Text',
                                name       : 'searchfield'
                            }
                        ]
                    },
                    {
                        docked: 'top',
                        xtype: 'toolbar',
                        items: [
                            {
                                xtype: 'selectfield',
                                name : 'options',
                                options: [
                                    {text: 'This is just a big select with a super long option',  value: '1'},
                                    {text: 'Another select item', value: '2'}
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }
});
