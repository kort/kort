module("kort-ValidationWebservice", {
    setup: function () {
        this.path = 'server/webservices/validation';
    }
});

test("thats a test", function(){
    expect(2);
    equals(true, false, "Fehlerhaft");
    equals("Wert", "Wert", "Erfolgreich");
});
