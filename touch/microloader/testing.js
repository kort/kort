/**
 * Sencha Blink - Testing
 * @author Jacky Nguyen <jacky@sencha.com>
 */
(function(global) {
    if (typeof Ext === 'undefined') {
        var Ext = global.Ext = {};
    }

    function write(content) {
        document.write(content);
    }

    function meta(name, content) {
        write('<meta name="' + name + '" content="' + content + '">');
    }

    Ext.blink = function(options) {
        var scripts = options.js || [],
            styleSheets = options.css || [],
            i, ln, path;

        meta('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no');
        /**
         * WORKAROUND FOR iOS6 Bug - Add to homescreen doesn't work correctly
         * see: http://www.sencha.com/forum/showthread.php?246317-2.1.0-RC1-Save-to-home-screen-Geolocation-not-working
         */
        //meta('apple-mobile-web-app-capable', 'yes');
        meta('apple-touch-fullscreen', 'yes');

        for (i = 0,ln = styleSheets.length; i < ln; i++) {
            path = styleSheets[i];

            if (typeof path != 'string') {
                path = path.path;
            }

            write('<link rel="stylesheet" href="'+path+'">');
        }

        for (i = 0,ln = scripts.length; i < ln; i++) {
            path = scripts[i];

            if (typeof path != 'string') {
                path = path.path;
            }

            write('<script src="'+path+'"></'+'script>');
        }
    }

})(this);
