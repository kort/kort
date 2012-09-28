# Using Carousels in Sencha Touch 2

{@link Ext.carousel.Carousel Carousels}, like [tabs](#!/guide/tabs), are a great way to allow the user to swipe through multiple full-screen pages.
A Carousel shows only one of its pages at a time but allows you to swipe through with your finger. You can think of a
Carousel as a single active item with the rest of the items stretching away left and right. Indicator dots show you how
many available screens there are to swipe through:

{@img carousel.jpg}

Carousels can be oriented either horizontally or vertically and are easy to configure - they just work like any other
Container. Here's how to set up a simple horizontal Carousel:

    @example preview
    Ext.create('Ext.Carousel', {
        fullscreen: true,

        defaults: {
            styleHtmlContent: true
        },

        items: [
            {
                html : 'Item 1',
                style: 'background-color: #5E99CC'
            },
            {
                html : 'Item 2',
                style: 'background-color: #759E60'
            },
            {
                html : 'Item 3'
            }
        ]
    });

Swiping your finger left and right over the carousel now swaps between the two items we defined above. It also updates
the indicator icon to let you know which page you're currently on. We can also make Carousels orient themselves
vertically:

    @example preview
    Ext.create('Ext.Carousel', {
        fullscreen: true,
        direction: 'vertical',

        defaults: {
            styleHtmlContent: true
        },

        items: [
            {
                html : 'Item 1',
                style: 'background-color: #759E60'
            },
            {
                html : 'Item 2',
                style: 'background-color: #5E99CC'
            }
        ]
    });

You can put anything in a Carousel, for example here we place a list and a form into a horizontal carousel

    @example portrait preview
    Ext.create('Ext.Carousel', {
        fullscreen: true,

        items: [
            {
                xtype: 'list',

                items: {
                    xtype: 'toolbar',
                    docked: 'top',
                    title: 'Sencha Touch Team'
                },

                store: {
                    fields: ['name'],
                    data: [
                        {name: 'Rob'},
                        {name: 'Ed'},
                        {name: 'Jacky'},
                        {name: 'Jamie'},
                        {name: 'Tommy'},
                        {name: 'Abe'}
                    ]
                },

                itemTpl: '{name}'
            },
            {
                xtype: 'fieldset',
                items: [
                    {
                        xtype: 'toolbar',
                        docked: 'top',
                        title: 'Login'
                    },
                    {
                        xtype: 'textfield',
                        label: 'Name'
                    },
                    {
                        xtype: 'passwordfield',
                        label: 'Password'
                    }
                ]
            }
        ]
    });
