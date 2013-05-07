module("kort-HighscoreWebservice", {
    setup: function () {
        this.path = 'server/webservices/highscore';
    }
});

test("first Test", function(highscore){
    expect(1);
    equals(highscore.ranking, undefined);
});

test("thats a test", function(){
    expect(2);
    equals(true, false, "Fehlerhaft");
    equals("Wert", "Wert", "Erfolgreich");
});
QUnit.log = function(result, message){
    alert(result);
}

test("get table", function() {
    var type = 'GET',
        data = null,
        url = urlLib.getAppUrl() + '/' + this.path;

    api_test(url, type, data, function (highscore) {
        notStrictEqual(highscore, undefined, "method call failed");

        notStrictEqual(highscore.user_id, [], "id field should be defined.");
        notStrictEqual(highscore.username, [], "username field should be defined.");
        notStrictEqual(highscore.koin_count, [], "koin count field should be defined.");
        notStrictEqual(highscore.ranking, [], "ranking field should be defined.");
    });
});

