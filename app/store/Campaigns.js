/**
 * Store for campaigns
 */
Ext.define('My.CampaignReader', {
    extend: 'Ext.data.reader.Json',
    alias: 'reader.campaigns',
    getData: function(data) {       // overriding
        data = this.callParent(arguments);
        var result = [];

        Ext.each(data.return, function(entry) {
            console.log("data " + debug(entry));
                result.push({
                    id: entry.id, startdate: entry.startdate, enddate:entry.enddate, extra_coins:entry.extra_coins,title:entry.title
                });
        });
        return data.return;
    }
});

function debug(object){
    var output = '';
    for (property in object) {
        output += property + ': ' + object[property]+'; ';
    }
    return output;
}

Ext.define('Kort.store.Campaigns', {
    extend: 'Ext.data.Store',

    config: {
        model: 'Kort.model.Campaign',
//        fields: [ 'id','startdate','enddate','extra_coins','title'],
        autoLoad:true,
        proxy: {
            type: 'ajax',
            url: './resources/stores/campaigns.json',
//            reader:'campaigns'

            reader: {
                type: 'json',
                rootProperty: 'return'
            }
        }
    }
});
