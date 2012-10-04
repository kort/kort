Ext.define('Kiva.view.LoansListItemCompletion', {
    extend: 'Ext.Component',

    config: {
        percentFunded: 0,

        cls: 'completion',
        height: 18,
        width: 100
    },

    updatePercentFunded: function(percentFunded) {
        var html = '<div class="bar" style="width:' + percentFunded + '%;"></div>';

        this.updateHtml(html);
    }
});