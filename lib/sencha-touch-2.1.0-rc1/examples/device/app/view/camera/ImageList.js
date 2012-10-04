Ext.define('Device.view.camera.ImageList', {
    extend: 'Ext.dataview.DataView',
    xtype: 'imageList',

    config: {
        cls: 'imageList',
        itemTpl: '<div class="x-img" style="background-image: url({src});">',
        store: 'Images'
    },

    initialize: function() {
        this.callParent();

        this.container.getDataItemConfig = this.getDataItemConfig;
    },

    getDataItemConfig: function(xtype, record, itemConfig) {
        return {
            xtype: xtype,
            record: record,
            defaults: itemConfig,
            src: record.get('src')
        };
    }
});
