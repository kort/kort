/**
 * Controller for login overlay
 */
Ext.define('Kort.controller.Login', {
    extend: 'Ext.app.Controller',
    requires: [
        'Ext.LoadMask'
    ],

    config: {
        views: [
            'overlay.login.Panel'
        ],
        refs: {
            loginPanel: '#loginPanel',
            mainTabPanel: '#mainTabPanel',
            loginButtonGoogle: '#loginButtonGoogle',
            loginButtonOsm: '#loginButtonOsm'
        },
        control: {
            loginButtonGoogle: {
                tap: 'onLoginButtonGoogleTap'
            },
            loginButtonOsm: {
                tap: 'onLoginButtonOsmTap'
            }
        }
    },

    // @private
    onLoginButtonGoogleTap: function() {
        console.log('loginButtonGoogle tapped -> ' + this.buildGoogleUrl(Kort.util.Config.getOAuth().google));
        this.showLoadMask();
        // redirect to google login page
        document.location.href = this.buildGoogleUrl(Kort.util.Config.getOAuth().google);
    },

    // @private
    onLoginButtonOsmTap: function() {
        console.log('loginButtonOsm tapped');
        this.showLoadMask();
        // redirect to osm login page
        document.location.href = Kort.util.Config.getOAuth().osm.url;
    },

    // @private
    showLoadMask: function() {
        this.getLoginPanel().setMasked({
            xtype: 'loadmask',
            message: Ext.i18n.Bundle.message('login.loadmask.message')
        });

        Ext.defer(this.hideLoadMask, Kort.util.Config.getTimeout(), this);
    },

    // @private
    hideLoadMask: function() {
        this.getLoginPanel().setMasked(false);
        console.log('something went wrong');
    },

    /**
     * @private
     * Creates google oauth url
     * @param {Object} oauth Google OAuth configuration
     */
    buildGoogleUrl: function(oauth) {
        var urlLib = new UrlLib(),
            params = urlLib.getUrlParams(),
            numScopes = oauth.scopes.length,
            url = oauth.url + '?',
            scopes = '', i;
        for (i = 0; i < numScopes; i++) {
            scopes += oauth.scopes[i] + '%20';
        }

        url  = oauth.url + '?';
        url += 'response_type=' + oauth.response_type + '&';
        url += 'client_id=' + oauth.client_id + '&';
        url += 'scope=' + scopes + '&';
        url += 'access_type=' + oauth.access_type + '&';
        url += 'redirect_uri=' + encodeURIComponent(urlLib.getAppUrl() + '/' + oauth.redirect_path) + '&';
        url += 'state=' + urlLib.getAppEnv() + '&';
        url += 'approval_prompt=' + (params.force ? 'force' : 'auto');

        return url;
    }
});