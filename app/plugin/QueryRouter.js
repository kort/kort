Ext.define('Kort.plugin.QueryRouter', {
    extend: 'Ext.app.Router',
    requires: ['Kort.plugin.QueryRoute'],

    connect: function(url, params) {
        params = Ext.apply({url: url}, params || {}, this.getDefaults());
        var route = Ext.create('Kort.plugin.QueryRoute', params);

        this.getRoutes().push(route);

        return route;
    }
});
