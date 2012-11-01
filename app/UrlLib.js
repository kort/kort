var global = this;

var UrlLib = function() {
	if(this === global) { return new UrlLib(); }

	var _this = this;
    var fullUrl = document.URL;
    var anchor = window.location.hash;

    _this.getCurrentUrl = function() {
        return fullUrl.replace('#' + anchor, '');
    };

    _this.getUrlParams = function() {
        var params = {};
        var urlParts = fullUrl.match(/\?(.*)$/i);
        var queryString = urlParts ? urlParts[1] : '';
        var paramRegex = /([^&=]+)=(([^&]*))?/g;
        var m;

        while (m = paramRegex.exec(queryString)) {
            params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
        }
        return params;
    };

    var setFullUrl = function(newUrl) {
        fullUrl = newUrl;
    };

    var setAnchor = function(newAnchor) {
        anchor = newAnchor;
        fullUrl = _this.getCurrentUrl() + "#" + newAnchor;
    };

    _this.__setFullUrl = setFullUrl;
    _this.__setAnchor = setAnchor;

    return _this;
};
