Ext.define('Kort.plugin.QueryRoute', {
    extend: 'Ext.app.Route',

    initialize: function() {
        this.callParent(arguments);
        this.parseQueryRegex = new RegExp("([^?=&]+)(?:=([^&]*))?", "g");
    },

    recognize: function(url) {
        var action = this.callParent(arguments),
            queryStr,
            query,
            match;

        if (action) {
            queryStr = action.args.pop();
            query = {};
            if (queryStr[0] === "?") {
                query = this._createQueryStringFromQuery(queryStr);
            }
            action.args.unshift(query);
        }
        return action;
    },

    createMatcherRegex: function(url) {
        var paramsInMatchString = this.paramsInMatchString,
            length = paramsInMatchString.length,
            i, cond, matcher;

        for (i = 0; i < length; i++) {
            cond    = this.getConditions()[paramsInMatchString[i]];
            matcher = Ext.util.Format.format("({0})", cond || "[%a-zA-Z0-9\\-\\_\\s,]+");

            url = url.replace(new RegExp(paramsInMatchString[i]), matcher);
        }

        return new RegExp("^" + url + "((?:\\?.*?)?)$");
    },

    _createQueryStringFromQuery: function(queryStr) {
        var query = {},
            match;
        queryStr = queryStr.slice(1);
        while ((match = this.parseQueryRegex.exec(queryStr)) !== null) {
            query[decodeURIComponent(match[1])] = (match[2] === undefined ? undefined : decodeURIComponent(match[2]));
        }
        return query;
    }


});