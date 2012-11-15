var urlLib = new UrlLib();
var params = urlLib.getUrlParams();
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
