var global = this;

function UrlLib () {
	if(this === global) { return new UrlLib(); }

	var _this = this;

    _this.getCurrentUrl = function() {
        var url = document.URL;
        return url.replace(window.location.hash, '');
    };

    _this.getUrlParams = function() {
        var params = {};
        var urlParts = location.href.match(/\?(.*)$/i);
        var queryString = urlParts ? urlParts[1] : '';
        var paramRegex = /([^&=]+)(=([^&]*))?/g;
        var m;

        while (m = paramRegex.exec(queryString)) {
            params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
        }
        return params;
    };

    return _this;
}
