module("kort-Availability");

test("Includes", function() {
	notStrictEqual(Ext, undefined, "Ext should be defined");
	notStrictEqual(L, undefined, "OpenLayers should be defined");
});