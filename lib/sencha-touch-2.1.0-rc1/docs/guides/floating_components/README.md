# Floating Components

Often in you need to have floating or centering components in your applications. Generally this happens when you need to ask the user what to do next, or perhaps when you want to show a dropdown style menu.

Sencha Touch allows you to do three things to achieve this:

- center any component on the screen
- absolutely position it on the screen (just like CSS)
- or show it by another component

## Centering a Component

You can center any component within its container in Sencha touch by using the {@link Ext.Component#centered centered} configuration. This will *always* center the component, even when its parent containers size changes.

    @example miniphone preview
    Ext.Viewport.add({
        xtype: 'panel',
        html: 'This is a centered panel',
        centered: true
    });

When using {@link Ext.Component#centered centered}, the width and height of the component is automatically set depending on the size of the content. However, if the content of the component is dynamic, like a scroller panel, the width and height must be set manually.

    @example miniphone
    Ext.Viewport.add({
        xtype: 'panel',
        scrollable: true,
        html: 'This is a scrollable centered panel with some long content so it will scroll.',
        centered: true,
        width: 100,
        height: 100
    });

Centered components are centered within their container. In the above examples we are adding a component into Ext.Viewport, so the component is centered in the center of the screen (as the Viewport is the full size of the screen). However, if we want, we can centered a component within a random sized container.

    @example phone preview
    Ext.Viewport.add({
        xtype: 'container',
        layout: 'hbox',
        items: [
            {
                flex: 1,
                html: 'left item',
                style: 'background:#eee;'
            },
            {
                flex: 2,
                html: 'right, item',
                items: [
                    {
                        xtype: 'panel',
                        html: 'This is a centered panel within this container',
                        centered: true
                    }
                ]
            }
        ]
    });

You can also use the {@link Ext.Component#setCentered setter} for centered to dynamically change if a component is centered or not at any time.

    @example miniphone preview
    var panel = Ext.Viewport.add({
        xtype: 'panel',
        layout: {
            type: 'vbox',
            align: 'center',
            pack: 'center'
        },
        items: [
            {
                xtype: 'button',
                text: 'toggle centered',
                handler: function() {
                    if (panel.isCentered()) {
                        panel.setCentered(false);
                        panel.setWidth(null);
                        panel.setHeight(null);
                    } else {
                        panel.setCentered(true);
                        panel.setWidth(200);
                        panel.setHeight(100);
                    }
                }
            }
        ]
    });

## Absolutely positioning a Component

You can also absolutey position a component in Sencha Touch using the {@link Ext.Component#top top}, {@link Ext.Component#right right}, {@link Ext.Component#bottom bottom} and {@link Ext.Component#left left} configurations of any {@link Ext.Component component}. This works just like CSS `position: absolute`.

For example, you can do the following (CSS):

    .element {
        position: absolute;
        left: 50px;
        bottom: 5px;
    }

..with a component in Sencha Touch like this:

    @example miniphone
    Ext.Viewport.add({
        xtype: 'panel',
        html: 'A floating component',
        top: 50,
        right: 5
    });

And of course, because these position properties are all configurations, you can use the appropriate setters to change them at any time:

    @example miniphone preview
    var panel = Ext.Viewport.add({
        xtype: 'panel',
        defaultType: 'button',
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        items: [
            {
                text: 'up',
                handler: function() {
                    panel.setTop(panel.getTop() - 5);
                }
            },
            {
                text: 'down',
                handler: function() {
                    panel.setTop(panel.getTop() + 5);
                }
            },
            {
                text: 'left',
                handler: function() {
                    panel.setLeft(panel.getLeft() - 5);
                }
            },
            {
                text: 'right',
                handler: function() {
                    panel.setLeft(panel.getLeft() + 5);
                }
            }
        ],
        top: 50,
        left: 5
    });

## Modal Components

Making a floating or centered container {@link Ext.Container#modal modal} masks the rest of its parent container so there are less distractions for the user. You simply set the {@link Ext.Container#modal modal} configuration to true.

    @example preview
    Ext.Viewport.add({
        xtype: 'panel',
        html: 'This is a centered and modal panel',
        modal: true,
        centered: true
    });

    Ext.Viewport.setHtml('This content is in the viewport and masked because the panel is modal.');
    Ext.Viewport.setStyleHtmlContent(true);

You can also use the {@link Ext.Container#hideOnMaskTap hideOnMaskTap} configuration to make the panel and mask disappear when a user taps on the mask:

    @example preview
    Ext.Viewport.add({
        xtype: 'panel',
        html: 'This is a centered and modal panel',
        modal: true,
        hideOnMaskTap: true,
        centered: true
    });

    Ext.Viewport.setHtml('This content is in the viewport and masked because the panel is modal.<br /><br />You can also tap on the mask to hide the panel.');
    Ext.Viewport.setStyleHtmlContent(true);

Please note that you can only add {@link Ext.Container#modal modal} to a {@link Ext.Container}, or subclass of it (like {@link Ext.Panel}).
