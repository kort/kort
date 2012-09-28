(function () {

    var seed = .5, count = 0;

    function random() {
        seed *= 15.1;
        seed -= Math.floor(seed);
        return seed;
    }

    var sprite, list = [], old1 = [0, 0], old2 = [0, 0];
    /**
     * Demonstrates smoothening and cubic bezier Curve rendering
     */
    Ext.define('Kitchensink.view.FreeDraw', {
        extend: 'Ext.Panel',
        requires: ['Kitchensink.view.FreeDrawComponent'],
        lastEvent: 0,
        config: {
            cls: 'card1',
            layout: 'fit',
            items: [
                {
                    xtype: 'toolbar',
                    docked: 'top',
                    items: [
                        {
                            text: 'Clear',
                            handler: function () {
                                var draw = Ext.getCmp('free-paint'),
                                    surface = draw.getSurface();
                                surface.getItems().clear();
                                surface.renderFrame();
                                draw.getSurface('overlay').getItems().clear();
                                draw.getSurface('overlay').renderFrame();
                            }
                        }
                    ]
                },
                {
                    xclass: 'Kitchensink.view.FreeDrawComponent',
                    id: 'free-paint'
                }
            ]
        }
    });
})();


