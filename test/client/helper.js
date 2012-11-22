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

/*inspired by http://www.beletsky.net/2010/12/testing-rest-services-with-javascript.html */
function api_test(url, type, data, callback, raw) {
    raw = raw || false;

    $.ajax({
        url: url,
        type: type,
        processData: false,
        contentType: 'application/json; charset=utf-8',
        data: data,
        dataType: 'json',
        async: false,
        complete: function (result) {
            if (raw) {
                callback(result);
            } else {
                if (result.status == 0) {
                    ok(false, '0 status - browser could be on offline mode');
                } else if (result.status == 404) {
                    ok(false, '404 error');
                } else {
                    callback($.parseJSON(result.responseText));
                }
            }
        }
    });
}