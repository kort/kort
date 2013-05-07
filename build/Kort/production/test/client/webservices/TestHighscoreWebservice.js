module("kort-HighscoreWebservice", {
    setup: function () {
        this.path = 'server/webservices/highscore';
    }
});

testSkip("get table", function() {
    var type = 'GET',
        data = null,
        url = urlLib.getAppUrl() + '/' + this.path;

    api_test(url, type, data, function (highscore) {
        notStrictEqual(highscore, undefined, "method call failed");

        notStrictEqual(highscore.user_id, undefined, "id field should be defined.");
        notStrictEqual(highscore.username, undefined, "username field should be defined.");
        notStrictEqual(highscore.koin_count, undefined, "koin count field should be defined.");
        notStrictEqual(highscore.ranking, undefined, "ranking field should be defined.");
    });


});
