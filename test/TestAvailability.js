module("kort-Availability");

test("Includes", function() {
	notStrictEqual(Ext, undefined, "Ext should be defined");
	notStrictEqual(OpenLayers, undefined, "OpenLayers should be defined");
});