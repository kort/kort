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
            loginButtonOsm: '#loginButtonOsm',
            loginButtonFacebook: '#loginButtonFacebook'

        },
        control: {
            loginButtonGoogle: {
                tap: '_onLoginButtonGoogleTap'
            },
            loginButtonOsm: {
                tap: '_onLoginButtonOsmTap'
            },
            loginButtonFacebook: {
                tap: '_onLoginButtonFacebookTap'
            }
        }
    },

    /**
     *
     * @private
     */
    _onLoginButtonGoogleTap: function() {
        this._showLoadMask();
        // redirect to google login page
        document.location.href = this._buildGoogleUrl(Kort.util.Config.getOAuth().google);
    },

    /**
     *
     * @private
     */
    _onLoginButtonOsmTap: function() {
        this._showLoadMask();
        // redirect to osm login page
        document.location.href = Kort.util.Config.getOAuth().osm.url;
    },

    /**
     *
     * @private
     */
    _onLoginButtonFacebookTap: function() {
        this._showLoadMask();
        //redirect to facebook login page
        document.location.href = this._buildFacebookUrl(Kort.util.Config.getOAuth().facebook);
    },

    /**
     *
     * @private
     */
    _showLoadMask: function() {
        this.getLoginPanel().setMasked({
            xtype: 'loadmask',
            message: Ext.i18n.Bundle.message('login.loadmask.message')
        });
        //ToDo Badly designed
        Ext.defer(this._hideLoadMask, Kort.util.Config.getTimeout(), this);
    },

    /**
     *
     * @private
     */
    _hideLoadMask: function() {
        this.getLoginPanel().setMasked(false);
        console.log('something went wrong');
    },

    /**
     *
     * @private
     * Creates google oauth url
     * @param {Object} oauth Google OAuth configuration
     */
    _buildGoogleUrl: function(oauth) {
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
    },

    /**
     *
     * @private
     * Creates facebook oauth url
     * @param oauth
     * @returns {Object} oauth Facebook OAuth configuration
     */
    _buildFacebookUrl: function(oauth) {
        var urlLib = new UrlLib(),
            url = '';
        url+= oauth.url+'?';
        url+='client_id='+oauth.client_id;
        url+='&redirect_uri='+ encodeURIComponent(urlLib.getAppUrl() + '/' + oauth.redirect_path);
        url+='&scope='+oauth.scopes.toString();
        url+='&response_type='+oauth.response_type;

        return url;
    }
});