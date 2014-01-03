module("kort-ValidationWebservice", {
    setup: function () {
        this.path = 'server/webservices/validation';
    }
});

testSkip("position", function () {
    var type = 'GET',
        data = null,
        url = urlLib.getAppUrl() + '/' + this.path + '/position/47.2332342000000000,8.8210699000000000';

    api_test(url, type, data, function (validations) {
        notStrictEqual(validations, undefined, "method call failed");
        ok(validations.length >= 1, "no validations have been returned");

        equal(validations.length, 4, "Not exactly 20 validations have been returned");

        var validation = validations[0];
        notStrictEqual(validation.id, undefined, "id field is absent");
        notStrictEqual(validation.type, undefined, "type field is absent");
        notStrictEqual(validation.osm_id, undefined, "osm_id field is absent");
        notStrictEqual(validation.osm_type, undefined, "osm_type field is absent");
        notStrictEqual(validation.title, undefined, "title field is absent");
        notStrictEqual(validation.upratings, undefined, "upratings field is absent");
        notStrictEqual(validation.downratings, undefined, "downratings field is absent");
        notStrictEqual(validation.latitude, undefined, "latitude field is absent");
        notStrictEqual(validation.longitude, undefined, "longitude field is absent");
        notStrictEqual(validation.view_type, undefined, "view_type field is absent");
        notStrictEqual(validation.required_votes, undefined, "required_votes field is absent");
    });
});

test("position - no params with trailing slash", function () {
    var type = 'GET',
        data = null,
        url = urlLib.getAppUrl() + '/' + this.path + '/position/';

    api_test(url, type, data, function (result) {
        equal(result.status, 404, "position w/o params should return 404.");
    }, true);
});

test("position - no params, no trailing slash", function () {
    var type = 'GET',
        data = null,
        url = urlLib.getAppUrl() + '/' + this.path + '/position';

    api_test(url, type, data, function (result) {
        equal(result.status, 404, "position w/o params should return 404.");
    }, true);
});