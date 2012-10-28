Ext.define('Kort.controller.Login', {
    extend: 'Ext.app.Controller',

    config: {
        views: [
            'login.Container'
        ],
        refs: {
            mainTabPanel: '#mainTabPanel',
            loginContainer: '#loginContainer',
            loginButton: '#loginButton'
        },
        control: {
            loginButton: {
                tap: 'onLoginButtonTap'
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
                client_id: '653755350671.apps.googleusercontent.com'
            }
        }
    },

    showLogin: function() {
        this.getMainTabPanel().setActiveItem(this.getLoginContainer());
    },

    onLoginButtonTap: function() {
        console.log('loginButton tapped -> ' + this.buildGoogleUrl(this.getRemote().google));
        document.location.href = this.buildGoogleUrl(this.getRemote().google);
    },

    buildGoogleUrl: function(oauth) {
        var url = oauth.url + '?';
        url += 'response_type=' + oauth.response_type + '&';
        url += 'client_id=' + oauth.client_id + '&';
        url += 'scope=' + oauth.scope + '&';
        url += 'redirect_uri=' + this.getCurrentUrl() + oauth.redirect_path;

        return url;
    },

    getCurrentUrl: function() {
        var url = document.URL;
        return url.replace(window.location.hash, '');
    }
});