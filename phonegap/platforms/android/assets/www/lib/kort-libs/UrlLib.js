(function(window) {
    window.UrlLib = function() {
        var me = this,
            fullUrl = document.URL,
            anchor = window.location.hash,
            setFullUrl, setAnchor;

        me.getCurrentUrl = function() {
            return fullUrl.replace('#' + anchor, '');
        };

        me.getAppUrl = function() {
            var host = window.location.host,
                url = 'http://' + host;

            if(this.isNative()) {
                url = "http://play.kort.ch"
            } else {
                if (host === 'localhost') {
                    url += '/kort';
                }
            }
            return url;
        };

        me.getAppEnv = function() {
            var host = window.location.host,
                pathname = window.location.pathname,
                env = '';

            if (host === 'localhost') {
                if(pathname.indexOf('build/production/Kort') > -1) {
                    env = 'production';
                } else if(pathname.indexOf('build/testing/Kort') > -1) {
                    env = 'testing'
                }
            }
            return env;
        };

        me.isNative = function() {
            return document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
        };

        me.getUrlParams = function() {
            var params = {},
                urlParts = fullUrl.match(/\?(.*)$/i),
                queryString = urlParts ? urlParts[1] : '',
                paramRegex = /([^&=]+)(=(([^&]*)))?/g,
                m;

            while (m = paramRegex.exec(queryString)) {
                params[decodeURIComponent(m[1])] = decodeURIComponent(m[3]);
            }
            return params;
        };

        setFullUrl = function(newUrl) {
            fullUrl = newUrl;
        };

        setAnchor = function(newAnchor) {
            anchor = newAnchor;
            fullUrl = me.getCurrentUrl() + "#" + newAnchor;
        };

        me.__setFullUrl = setFullUrl;
        me.__setAnchor = setAnchor;
    };

})(this);
