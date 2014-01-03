module("kort-MissionWebservice", {
    setup: function () {
        this.path = 'server/webservices/mission';
    }
});

test("position", function() {
	var type = 'GET',
        data = null,
        url = urlLib.getAppUrl() + '/' + this.path + '/position/47.3441552,8.531329900000003';

    api_test(url, type, data, function (missions) {
        notStrictEqual(missions, undefined, "method call failed");
        ok(missions.length >= 1, "no missions have been returned");

        equal(missions.length, 20, "Not exactly 20 missions have been returned");

        var mission = missions[0];
        notStrictEqual(mission.id, undefined, "id field is absent");
        notStrictEqual(mission.schema, undefined, "schema field is absent");
        notStrictEqual(mission.type, undefined, "type field is absent");
        notStrictEqual(mission.osm_id, undefined, "osm_id field is absent");
        notStrictEqual(mission.osm_type, undefined, "osm_type field is absent");
        notStrictEqual(mission.title, undefined, "title field is absent");
        notStrictEqual(mission.description, undefined, "description field is absent");
        notStrictEqual(mission.latitude, undefined, "latitude field is absent");
        notStrictEqual(mission.longitude, undefined, "longitude field is absent");
        notStrictEqual(mission.view_type, undefined, "view_type field is absent");
        notStrictEqual(mission.answer_placeholder, undefined, "answer_placeholder field is absent");
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

testSkip("fix", function() {
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