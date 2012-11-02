var global = this;

var UrlLib = function() {
	if(this === global) { return new UrlLib(); }

	var _this = this,
        fullUrl = document.URL,
        anchor = window.location.hash,
        setFullUrl, setAnchor;

    _this.getCurrentUrl = function() {
        return fullUrl.replace('#' + anchor, '');
    };

    _this.getUrlParams = function() {
        var params = {},
            urlParts = fullUrl.match(/\?(.*)$/i),
            queryString = urlParts ? urlParts[1] : '',
            paramRegex = /([^&=]+)=(([^&]*))?/g,
            m;

        while (m = paramRegex.exec(queryString)) {
            params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
        }
        return params;
    };

    setFullUrl = function(newUrl) {
        fullUrl = newUrl;
    };

    setAnchor = function(newAnchor) {
        anchor = newAnchor;
        fullUrl = _this.getCurrentUrl() + "#" + newAnchor;
    };

    _this.__setFullUrl = setFullUrl;
    _this.__setAnchor = setAnchor;

    return _this;
};
