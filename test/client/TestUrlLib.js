module("kort-UrlLib");

module("kort-UrlLib", {
  setup: function() {
    this.urlLib = new UrlLib();
  }
});

test("Constructor", function() {
	notStrictEqual(UrlLib, undefined, "UrlLib should be defined");
    ok(this.urlLib instanceof UrlLib, "Instance should be of type UrlLib");
});