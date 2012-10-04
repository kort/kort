/**
 * @class Ext.data.KivaProxy
 * @extends Ext.data.ScriptTagProxy
 *
 * Kiva does not have a JSON-P API, making it challenging to access their data using a purely client-side
 * application. To get around this, we use Yahoo's YQL service, which acts as a proxy allowing us to use
 * the API as though it was any other data source.
 *
 * To make this work we've set up a very simple subclass of the ScriptTagProxy, which is a Proxy that lets
 * us load data from a different domain (http://query.yahooapis.com in this case). The only extra logic we
 * add is in buildRequest, where we modify the request url to include the YQL statement we need to perform
 * our search.
 *
 * See http://developer.yahoo.com/yql/ for more information about YQL.
 */
Ext.define('Ext.data.proxy.Kiva', {
    extend: 'Ext.data.proxy.JsonP',
    requires: ['Ext.XTemplate'],
    alias: 'proxy.kiva',
    autoAppendParams: false,

    /**
     * The Proxy will always use this url for all requests - Yahoo's YQL service does the rest with the
     * query that we send it in {@link #buildRequest}
     */
//    url: 'http://query.yahooapis.com/v1/public/yql',
//    _url: 'http://query.yahooapis.com/v1/public/yql',
    _url: 'fake.json',

    /**
     * This proxy uses YQL, which is an SQL-like way of accessing remote data. We are using an XTemplate
     * to generate the search query. See {@link #buildRequest} for more details
     */
    queries: {
        search: Ext.create('Ext.XTemplate', [
            'use "http://github.com/extjs/YQL-Tables/raw/master/kiva/loanSearch.xml" as loansearch; ',
            'use "http://github.com/extjs/YQL-Tables/raw/master/kiva/loanInfo.xml" as loaninfo; ',
            'select * from loaninfo where ids IN (select id from loansearch where status="fundraising"',
            '<tpl if="sort_by"> AND sort_by="{sort_by}"</tpl>',
            '<tpl if="gender"> AND gender="{gender}"</tpl>',
            '<tpl if="region"> AND region="{region}"</tpl>',
            '<tpl if="sector"> AND sector="{sector}"</tpl>',
            '<tpl if="q"> AND q="{q}"</tpl>)'
            // {compiled: true}
        ])
    },

    /**
     * We need to add a little processing to the normal buildRequest. In YQL we send an SQL-like
     * query statement - in this case using the search query above. To honor the filters applied
     * by the user, we pull those out in this function and apply them to the search XTemplate.
     * Finally, we modify the url to add this generated query and any other required parameters.
     */
    buildRequest: function(operation) {
        var request    = this.callParent(arguments),
            queryTpl   = this.queries.search,
            filters    = operation.getFilters() || [],
            params     = request.getParams(),
            filterData = {};

        Ext.iterate(filters, function(filter) {
            filterData[filter.getProperty()] = filter.getValue();
        });

        delete params.filters;

        Ext.applyIf(params, {
            format: 'json',
            q: queryTpl.applyTemplate(filterData)
        });

        request.setParams(params);
        request.setUrl(Ext.urlAppend(request.getUrl(), Ext.urlEncode(params)));
        return request;
    }
});
