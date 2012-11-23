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
            loginButtonGoogle: '#loginButtonGoogle'
        },
        control: {
            loginButtonGoogle: {
                tap: 'onLoginButtonGoogleTap'
            }
        },

        remote: {
            google: {
                url: 'https://accounts.google.com/o/oauth2/auth',
                scopes: [
                    'https://www.googleapis.com/auth/userinfo.profile',
                    'https://www.googleapis.com/auth/userinfo.email'
                ],
                redirect_path: 'server/oauth2callback',
                response_type: 'code',
                access_type: 'offline',
                client_id: '653755350671.apps.googleusercontent.com'
            }
        }
    },

    onLoginButtonGoogleTap: function() {
        console.log('loginButtonGoogle tapped -> ' + this.buildGoogleUrl(this.getRemote().google));
        this.showLoadMask();
        // redirect to google login page
        document.location.href = this.buildGoogleUrl(this.getRemote().google);
    },

    showLoadMask: function() {
        this.getLoginPanel().setMasked({
            xtype: 'loadmask',
            message: Ext.i18n.Bundle.message('login.loadmask.message')
        });

        Ext.defer(this.hideLoadMask, Kort.util.Config.getTimeout(), this);
    },

    hideLoadMask: function() {
        this.getLoginPanel().setMasked(false);
        console.log('something went wrong');
    },

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