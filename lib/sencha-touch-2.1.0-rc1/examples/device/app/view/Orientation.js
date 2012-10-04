Ext.define('Device.view.Orientation', {
    extend: 'Ext.Container',

    requires: [
        'Ext.device.Orientation'
    ],

    config: {
        title: 'Orientation',
        iconCls: 'compass1',

        items: [
            {
                xtype: 'titlebar',
                docked: 'top',
                ui: 'light',
                items: [
                    {
                        text: 'Reset',
                        align: 'right'
                    }
                ]
            },
            {
                id: 'information',
                styleHtmlContent: true,
                html: 'no information received'
            },
            {
                id: 'cube',
                html: '<div></div><div></div><div></div><div></div><div></div><div></div>',
                centered: true
            }
        ]
    },

    initialize: function() {
        this.on({
            painted: 'onPainted',
            erased : 'onErased'
        });

        this.on({
            delegate: 'button',
            tap: 'onReset'
        });

        if (!Ext.feature.has.Css3dTransforms) {
            Ext.getCmp('cube').hide();
        }
    },

    onReset: function() {
        this.originalOrientation = null;
    },

    onPainted: function() {
        Ext.device.Orientation.on('orientationchange', 'onDeviceOrientation', this);
    },

    onErased: function() {
        Ext.device.Orientation.un('orientationchange', 'onDeviceOrientation', this);
        this.originalOrientation = null;
    },

    onDeviceOrientation: function(e) {
        var alpha = Math.round(e.alpha),
            beta = Math.round(e.beta),
            gamma = Math.round(e.gamma),
            origin;

        if (!this.originalOrientation) {
            this.originalOrientation = {
                alpha: alpha,
                beta: beta,
                gamma: gamma
            };

            return;
        }
        else {
            origin = this.originalOrientation;

            alpha -= origin.alpha;
            beta -= origin.beta;
            gamma -= origin.beta;
        }

        Ext.getCmp('information').setHtml([
            'This example is best viewed when your phone is on a flat surface.<br /><br />',
            '<b>alpha</b>: ' + alpha,
            '<br /><b>beta</b>: ' + beta,
            '<br /><b>gamma</b>: ' + gamma
        ].join(''));

        if (!this.originalOrientation) {
            this.originalOrientation = {
                alpha: alpha,
                beta: beta,
                gamma: gamma
            };

            return;
        }
        else {
            origin = this.originalOrientation;

            alpha -= origin.alpha;
            beta -= origin.beta;
            gamma -= origin.beta;
        }

        if (Ext.feature.has.Css3dTransforms) {
            Ext.getCmp('cube').element.dom.style.webkitTransform = 'rotateX('+beta+'deg) rotateY('+alpha+'deg)';
        }
    }
});
