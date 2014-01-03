module("kort-UrlLib", {
  setup: function() {
    this.urlLib = new UrlLib();
    this.urlLib.__setFullUrl(this.generateLocalUrl());
  },

  generateLocalUrl: function() {
    return "http://localhost/kort/test/client/";
}
});

test("Constructor", function() {
	notStrictEqual(UrlLib, undefined, "UrlLib should be defined");
    ok(this.urlLib instanceof UrlLib, "Instance should be of type UrlLib");
});

test("getCurrentUrl", function() {
    equal(this.urlLib.getCurrentUrl(), this.generateLocalUrl(), "URL should match the given url");
});

test("getCurrentUrl with anchor", function() {
    this.urlLib.__setFullUrl(this.generateLocalUrl());
    this.urlLib.__setAnchor("test");
    equal(this.urlLib.getCurrentUrl(), this.generateLocalUrl(), "URL should match the given url w/o the anchor");
});

test("getUrlParams", function() {
    this.urlLib.__setFullUrl(this.generateLocalUrl() + "?test=testvalue&number=123");
    equal(typeof this.urlLib.getUrlParams(), "object", "Should return GET parameters as object");

    notStrictEqual(this.urlLib.getUrlParams().test, undefined, "Property 'test' should be set");
    strictEqual(this.urlLib.getUrlParams().test, "testvalue", "Property 'test' should have the correct value");

    notStrictEqual(this.urlLib.getUrlParams().number, undefined, "Property 'number' should be set");
    strictEqual(this.urlLib.getUrlParams().number, "123", "Property 'number' should have the correct value");

    strictEqual(this.urlLib.getUrlParams().notexisting, undefined, "Property 'notexisting' should *not* exist");
});

test("getUrlParams without values", function() {
    this.urlLib.__setFullUrl(this.generateLocalUrl() + "?force");
    equal(typeof this.urlLib.getUrlParams(), "object", "Should return GET parameters as object");

    notStrictEqual(this.urlLib.getUrlParams().force, undefined, "Property 'force' should be set");
    strictEqual(this.urlLib.getUrlParams().force, "undefined", "Property 'force' should have the correct value");
});

test("getAppUrl", function() {
    if (window.location.host === 'localhost') {
        equal(this.urlLib.getAppUrl(), "http://localhost/kort", "Should return correct app url");
    } else {
        equal(this.urlLib.getAppUrl(), "http://" + window.location.host, "Should return correct app url");
    }

});