module("kort-ValidationWebservice", {
    setup: function () {
        this.path = 'server/webservices/validation';
    }
});

test("position", function() {
    var type = 'GET',
        data = null,
        url = urlLib.getAppUrl() + '/' + this.path + '/position/47.3441552,8.531329900000003';

    api_test(url, type, data, function (validation) {
        notStrictEqual(validation, undefined, "method call failed");
        ok(validation.length >= 1, "no bugs have been returned");

        equal(validation.length, 20, "Not exactly 20 validations have been returned");

        var bug = bugs[0];
        notStrictEqual(validation.id, undefined, "id field is absent");
        notStrictEqual(validation.schema, undefined, "schema field is absent");
        notStrictEqual(validation.type, undefined, "type field is absent");
        notStrictEqual(validation.osm_id, undefined, "osm_id field is absent");
        notStrictEqual(validation.osm_type, undefined, "osm_type field is absent");
        notStrictEqual(validation.title, undefined, "title field is absent");
        notStrictEqual(validation.description, undefined, "description field is absent");
        notStrictEqual(validation.latitude, undefined, "latitude field is absent");
        notStrictEqual(validation.longitude, undefined, "longitude field is absent");
        notStrictEqual(validation.view_type, undefined, "view_type field is absent");
        notStrictEqual(validation.answer_placeholder, undefined, "answer_placeholder field is absent");
    });
});

test("position - no params with trailing slash", function() {
    var type = 'GET',
        data = null,
        url = urlLib.getAppUrl() + '/' + this.path + '/position/';

    api_test(url, type, data, function (result) {
        equal(result.status, 404, "position w/o params should return 404.");
    }, true);
});

test("position - no params, no trailing slash", function() {
    var type = 'GET',
        data = null,
        url = urlLib.getAppUrl() + '/' + this.path + '/position';

    api_test(url, type, data, function (result) {
        equal(result.status, 404, "position w/o params should return 404.");
    }, true);
});

test("fix", function() {
    var type = 'POST',
        data = {
            id: 12345,
            create_date: '2012-11-19',
            error_id: 6716165,
            message: 'Test fix'
        },
        url = urlLib.getAppUrl() + '/' + this.path + '/fix';

    api_test(url, type, data, function (result) {
        console.log(result);
        equal(result.status, 200, "Post to /mission/fix should be okay.");
    }, true);
});