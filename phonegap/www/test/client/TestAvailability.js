module("kort-Availability");

test("Includes", function() {
	notStrictEqual(Ext, undefined, "Ext should be defined");
	notStrictEqual(L, undefined, "Leaflet should be defined");
});