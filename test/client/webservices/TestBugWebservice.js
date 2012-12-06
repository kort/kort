module("kort-BugWebservice", {
    setup: function () {
        this.path = 'server/webservices/bug';
    }
});

testSkip("position", function() {
	var type = 'GET',
        data = null,
        url = urlLib.getAppUrl() + '/' + this.path + '/position/47.3441552,8.531329900000003';

    api_test(url, type, data, function (bugs) {
        notStrictEqual(bugs, undefined, "method call failed");
        ok(bugs.length >= 1, "no bugs have been returned");

        equal(bugs.length, 20, "Not exactly 20 bugs have been returned");

        var bug = bugs[0];
        notStrictEqual(bug.id, undefined, "id field is absent");
        notStrictEqual(bug.schema, undefined, "schema field is absent");
        notStrictEqual(bug.type, undefined, "type field is absent");
        notStrictEqual(bug.osm_id, undefined, "osm_id field is absent");
        notStrictEqual(bug.osm_type, undefined, "osm_type field is absent");
        notStrictEqual(bug.title, undefined, "title field is absent");
        notStrictEqual(bug.description, undefined, "description field is absent");
        notStrictEqual(bug.latitude, undefined, "latitude field is absent");
        notStrictEqual(bug.longitude, undefined, "longitude field is absent");
        notStrictEqual(bug.view_type, undefined, "view_type field is absent");
        notStrictEqual(bug.answer_placeholder, undefined, "answer_placeholder field is absent");
    });
});

testSkip("position - no params with trailing slash", function() {
	var type = 'GET',
        data = null,
        url = urlLib.getAppUrl() + '/' + this.path + '/position/';

    api_test(url, type, data, function (result) {
        equal(result.status, 404, "position w/o params should return 404.");
    }, true);
});

testSkip("position - no params, no trailing slash", function() {
	var type = 'GET',
        data = null,
        url = urlLib.getAppUrl() + '/' + this.path + '/position';

    api_test(url, type, data, function (result) {
        equal(result.status, 404, "position w/o params should return 404.");
    }, true);
});

testSkip("fix", function() {
	var type = 'POST',
        data = {
            id: 12345,
            create_date: '2012-11-19',
            error_id: 6716165,
            message: 'Test fix message'
        },
        url = urlLib.getAppUrl() + '/' + this.path + '/fix';

    api_test(url, type, data, function (result) {
        console.log(result);
        equal(result.status, 200, "Post to /bug/fix should be okay.");
    }, true);
});