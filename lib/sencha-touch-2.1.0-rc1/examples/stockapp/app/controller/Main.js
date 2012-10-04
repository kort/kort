Ext.define("StockApp.controller.Main", {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            mainChart: '#mainChart',
            preview: 'preview'
        },

        control: {
            '#mainChart axis': {
                transformed: function (axis, visibleRange) {
                    var rangeMask = this.getPreview().getSurface('overlay').getItems().items[0];
                    rangeMask.setAttributes({visibleRange: visibleRange.concat([0, 1])});
                    this.getPreview().getSurface('overlay').renderFrame();
                }
            }
        }
    }
});