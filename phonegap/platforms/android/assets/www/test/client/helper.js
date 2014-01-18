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

/* add another kind of test to indicate tests that must be skipped for the moment */
/* inspired by http://studgeek.com/2012/03/12/custom-jquery-qunit-test-types/ */
QUnit.testSkip = function() {
   QUnit.test(arguments[0] + ' (SKIPPED)', function() {
       var li = document.getElementById(QUnit.config.current.id);
       QUnit.done(function() {
           li.style.background = '#FFFF99';
       });
   });
};
testSkip = QUnit.testSkip;

/*inspired by http://www.beletsky.net/2010/12/testing-rest-services-with-javascript.html */
function api_test(url, type, data, callback, raw) {
    var callbackbWrapper;

    raw = raw || false;
    if (raw) {
        callbackbWrapper = function(result) {callback(result);};
    } else {
        callbackbWrapper = function(result) {
            if (result.status === 0) {
                ok(false, '0 status - browser could be on offline mode');
            } else if (result.status === 404) {
                ok(false, '404 error');
            } else {
                callback($.parseJSON(result.responseText).return);
            }
        };
    }

    $.ajax({
        url: url,
        type: type,
        processData: false,
        contentType: 'application/json; charset=utf-8',
        data: data,
        dataType: 'json',
        async: false,
        complete: function (result) {
            callbackbWrapper(result);
        }
    });
}