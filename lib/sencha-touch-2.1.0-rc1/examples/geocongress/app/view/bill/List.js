/**
 * A list of Bills
 */
Ext.define('GeoCon.view.bill.List', {
    extend: 'Ext.dataview.List',

    id: 'billList',

    config: {
        store: 'Bills',
        grouped: true,

        itemTpl: Ext.create('Ext.XTemplate',
            '<div class="bill">',
                '{[this.shortTitle(values.titles)]}',
            '</div>',
            {
                shortTitle: function(titles) {
                    return titles[0].title;
                }
            }
        )
    }
});
