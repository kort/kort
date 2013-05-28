module("kort-HighscoreWebservice", {
    setup: function () {
        this.path = 'server/webservices/highscore';
    }
});

test("get table", function() {
    var type = 'GET',
        data = null,
        url = urlLib.getAppUrl()+ '/' + this.path;

    api_test(url, type, data, function (highscore) {
        notStrictEqual(highscore, undefined, "method call failed");

        notStrictEqual(highscore.user_id, [], "id field should be defined.");
        notStrictEqual(highscore.username, [], "username field should be defined.");
        notStrictEqual(highscore.koin_count, [], "koin count field should be defined.");
        notStrictEqual(highscore.ranking, [], "ranking field should be defined.");
    });
});

