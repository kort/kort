module("kort-UserWebservice", {
    setup: function () {
        this.path = 'server/webservices/user';
    }
});

testSkip("get user", function() {
	var type = 'GET',
        data = null,
        url = urlLib.getAppUrl() + '/' + this.path + '/09821093801923';

    api_test(url, type, data, function (user) {
        notStrictEqual(user, undefined, "method call failed");

        notStrictEqual(user.id, undefined, "id field should be defined.");
        notStrictEqual(user.username, undefined, "username field should be defined.");
        notStrictEqual(user.email, undefined, "email field should be defined.");
        notStrictEqual(user.token, undefined, "token field should be defined.");
        notStrictEqual(user.loggedIn, undefined, "loggedIn field should be defined.");
    });
});

testSkip("create user", function() {
	var type = 'POST',
        data = {
            username: 'testuser',
            email: 'test@kort.ch'
        },
        url = urlLib.getAppUrl() + '/' + this.path + '/';

    api_test(url, type, data, function (result) {
        console.log(result);
        equal(result.status, 200, "Post to /user should be okay.");
    }, true);
});