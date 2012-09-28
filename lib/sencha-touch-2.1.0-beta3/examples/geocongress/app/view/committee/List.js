/**
 * A list of Committees
 */
Ext.define('GeoCon.view.committee.List', {
    extend: 'Ext.dataview.List',

    id: 'committeeList',

    config: {
        store: 'Committees',
        scrollable: false,

        itemTpl: [
            '<div class="committee">{name}</div>'
        ]
    }
});
