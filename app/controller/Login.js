Ext.define('Kort.controller.Login', {
    extend: 'Ext.app.Controller',

    config: {
        views: [
            'login.Container'
        ],
        refs: {
            mainTabPanel: '#mainTabPanel',
            loginContainer: '#loginContainer',
            loginButtonGoogle: '#loginButtonGoogle'
        },
        control: {
            loginButtonGoogle: {
                tap: 'onLoginButtonGoogleTap'
            }
        },
        routes: {
            'login': 'showLogin'
        },

        remote: {
            google: {
                url: 'https://accounts.google.com/o/oauth2/auth',
                scope: 'https://www.googleapis.com/auth/userinfo.profile',
                redirect_path: 'server/oauth2callback',
                response_type: 'code',
                access_type: 'offline',
                client_id: '653755350671.apps.googleusercontent.com'
            }
        }
    },

    showLogin: function() {
        this.getMainTabPanel().setActiveItem(this.getLoginContainer());
    },

    onLoginButtonGoogleTap: function() {
        console.log('loginButtonGoogle tapped -> ' + this.buildGoogleUrl(this.getRemote().google));
        document.location.href = this.buildGoogleUrl(this.getRemote().google);
    },

    buildGoogleUrl: function(oauth) {
        var urlLib = new UrlLib();
        var url = oauth.url + '?';
        url += 'response_type=' + oauth.response_type + '&';
        url += 'client_id=' + oauth.client_id + '&';
        url += 'scope=' + oauth.scope + '&';
        url += 'access_type=' + oauth.access_type + '&';
        url += 'redirect_uri=' + urlLib.getCurrentUrl() + oauth.redirect_path + '&';
        url += 'approval_prompt=' + urlLib.getUrlParams().force;

        return url;
    }
});