Ext.define('Device.view.Contacts', {
    extend: 'Ext.Container',

    requires: [
        'Ext.device.Contacts',
        'Device.view.contacts.Detail'
    ],

    config: {
        title: 'Contacts',
        iconCls: 'address_book',
        scrollable: true
    },

    initialize: function() {
        var me = this;

        this.callParent(arguments);

        Ext.device.Contacts.getContacts({
            scope: this,
            success: function(store) {
                //localized
                var replacements = {},
                    ln = 0;
                
                var localize = function(obj) {
                    if (typeof obj == "object" && obj.length) {
                        for (var i = 0; i<obj.length;i++) {
                            localize(obj[i]);
                        }
                    } else {
                        if (typeof obj == "object") {
                            for (var a in obj) {
                                if (typeof replacements[a] == "undefined") {
                                    replacements[a] = null;
                                    ln++;
                                }
                                localize(obj[a]);
                            }
                        }
                    }
                };

                var localized = store;
                localize(localized);

                var replaceKey = function(object, key, replacement) {
                    if (typeof object == "object" && typeof object.length == "undefined") {
                        for (var a in object) {

                            if (a == key && replacement != key) {
                                object[replacement] = object[a];
                                delete object[a];
                            }

                            if (typeof object[a] == "object" && typeof object[a].length == "undefined") {
                                replaceKey(object[a], key, replacement);
                            }
                        }
                    } else {
                        for (var k = 0; k < object.length; k++) {
                            replaceKey(object[k], key, replacement);
                        }
                    }

                    return object;
                };

                var getLocalizedLabelCallback = function() {
                    ln--;

                    if (ln == 0) {
                        for (var a in replacements) {
                            if (replacements[a]) {
                                replaceKey(localized, a, replacements[a]);
                            }
                        }

                        localized = JSON.stringify(localized, null, 2);
                        localized = localized.replace(/ /g, '&nbsp;');
                        localized = localized.replace(/\n/g, '<br />');

                        this.setHtml(localized);
                    }
                };

                Ext.Object.each(replacements, function(key) {
                    if (replacements[key]) {
                        ln--;
                        return;
                    }

                    Ext.device.Contacts.getLocalizedLabel({
                        label: key,
                        callback: function(newLabel, originalLabel) {
                            replacements[originalLabel] = newLabel;
                            getLocalizedLabelCallback.call(me);
                        },
                        scope: this
                    });
                }, this);
            }
        });
    }
});
