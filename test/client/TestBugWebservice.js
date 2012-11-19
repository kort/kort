module("kort-BugWebservice", {
    setup: function () {
        this.path = 'server/webservices/bug';
    }
});

test("position", function() {
	var method = 'position',
        data = null,
        type = 'GET',
        param = '47.3441552,8.531329900000003', url;

    url = urlLib.getAppUrl() + this.path + '/' + method + '/' + param;

    api_test(url, type, data, function (bugs) {
        notStrictEqual(bugs, undefined, method + " method call failed");
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