module("kort-AnswerWebservice", {
    setup: function () {
        this.path = 'server/webservices/answer';
    }
});

testSkip("root", function() {
	var type = 'GET',
        data = null,
        url = urlLib.getAppUrl() + '/' + this.path + '/?limit=10';

    api_test(url, type, data, function (answers) {
        notStrictEqual(answers, undefined, "method call failed");
        ok(answers.length >= 1, "no answers have been returned");

        equal(answers.length, 10, "Exactly 10 answers should be returned");

        var answer = answers[0];
        notStrictEqual(answer.id, undefined, "id field is absent");
        notStrictEqual(answer.value, undefined, "value field is absent");
        notStrictEqual(answer.title, undefined, "title field is absent");
        notStrictEqual(answer.sorting, undefined, "sorting field is absent");
        notStrictEqual(answer.type, undefined, "type field is absent");
    });
});

test("missing_track_type", function() {
	var type = 'GET',
        data = null,
        url = urlLib.getAppUrl() + '/' + this.path + '/missing_track_type?limit=5';

    api_test(url, type, data, function (answers) {
        notStrictEqual(answers, undefined, "method call failed");
        ok(answers.length >= 1, "no answers have been returned");
        equal(answers.length, 5, "Exactly 5 answers should be returned");

        $.each(answers, function() {
            strictEqual(this.type, 'missing_track_type', "Only answer with type missing_track_type should be returned");
            notStrictEqual(this.id, undefined, "id field is absent");
            notStrictEqual(this.value, undefined, "value field is absent");
            notStrictEqual(this.title, undefined, "title field is absent");
            notStrictEqual(this.sorting, undefined, "sorting field is absent");
        });
    });
});

testSkip("not existings type", function() {
	var type = 'GET',
        data = null,
        url = urlLib.getAppUrl() + '/' + this.path + '/does_not_exist_test';

    api_test(url, type, data, function (result) {
        equal(result.status, 404, "not existing answer type should return 404.");
    }, true);
});