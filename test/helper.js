function getUrlParams() {
	var params = {};
	var urlParts = location.href.match(/\?(.*)$/i);
	var queryString = urlParts ? urlParts[1] : '';
	var paramRegex = /([^&=]+)(=([^&]*))?/g;
	var m;
	
	while (m = paramRegex.exec(queryString)) {
		params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
	}
	return params;
}

var params = getUrlParams();
if (params.debug !== undefined) {
	console.log('######################################');
	console.log('#        DEBUG MODE ENABLED          #');
	console.log('######################################');
	console.log('');
	
	QUnit.begin = function() {
		console.log('####');
	};
	
	QUnit.testStart = function(test) {
		var module = test.module ? test.module : '';
		console.log('#' + module + " " + test.name + ": started.");
	};

	QUnit.testDone = function(test) {
		var module = test.module ? test.module : '';
		console.log('#' + module + " " + test.name + ": done.");
		console.log('####');
	};
}
