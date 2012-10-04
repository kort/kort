/**
 * A summary of a Bill
 */
Ext.define('GeoCon.view.bill.Show', {
    extend: 'Ext.Container',

    id: 'billSummary',

    config: {

        scrollable: 'vertical',

        items: [
            {
                id: 'billSummaryToolbar',
                docked: 'top',
                xtype: 'toolbar',
                items: [
                    {
                        xtype: 'button',
                        text: 'Back',
                        ui: 'back',
                        id: 'billSummaryBackButton'
                    }
                ]
            }
        ],
        tpl: [
            '{summary}'
        ]
    }
});
