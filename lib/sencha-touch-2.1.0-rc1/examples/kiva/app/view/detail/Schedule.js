Ext.define('Kiva.view.detail.Schedule', {
    extend: 'Ext.Container',
    xtype: 'detailSchedule',
    requires: ['Ext.DateExtras'],

    config: {
        cls: 'detail-card',
        styleHtmlContent: true,
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },

        tpl: Ext.create('Ext.XTemplate',
            '<h1>Repayment Schedule</h1>',
            '<tpl for=".">',
                '<div class="payment">',
                    '<div>{[this.formatDueDate(values.due_date)]} <span>${amount}</span></div>',
                '</div>',
            '</tpl>',
            {
                formatDueDate: function(date) {
                    date = date.split('T')[0];

                    var format = "j M Y";
                        parsed = new Date(Ext.Date.parse(date, "Y-m-d"));
                    
                    return Ext.Date.format(parsed, format);
                }
            }
        )
    }
});