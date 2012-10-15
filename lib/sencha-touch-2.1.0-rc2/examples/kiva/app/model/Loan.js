/**
 * @class Loan
 * @extends Ext.data.Model
 * The Loan model is the only model we need in this simple application. We're using a custom Proxy for
 * this application to enable us to consume Kiva's JSON api. See lib/KivaProxy.js to see how this is done
 */
Ext.define('Kiva.model.Loan', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
            {name: "id",             type: "int"},
            {name: "name",           type: "string"},
            {name: "status",         type: "string"},
            {name: "loan_amount",    type: "int"},
            {name: "funded_amount",  type: "int"},
            {name: "basket_amount",  type: "int"},
            {name: "borrower_count", type: "int"},
            {name: "activity",       type: "string"},
            {name: "sector",         type: "string"},
            {name: "use",            type: "string"},
            {name: "partner_id",     type: "int"},
            {name: "description",    type: "string", mapping: "description.texts.en"},
            {name: "image", type: "string", mapping: "image.id", convert: function(value, record) {
                return "http://kiva.org/img/w80h80/" + value + ".jpg";
            }},
            'terms', 'location',
            {
                name: 'percent_funded', convert: function(v, record) {
                    return parseInt(record.data.funded_amount / record.data.loan_amount * 100, 10);
                }
            }
        ],

        proxy: {
            type: 'kiva',

            reader: {
                type: 'json',
                successProperty: 'success',
                rootProperty: function(data) {
                    if (data.error || data.query.count === 0) {
                        return [];
                    } else {
                        return data.query.results.loans;
                    }
                }
            }
        }
    }
});
