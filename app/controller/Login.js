Ext.define('Kort.controller.Login', {
    extend: 'Ext.app.Controller',

    config: {
        views: [
            'login.Container'
        ],
        refs: {
            mainTabPanel: '#mainTabPanel',
            loginContainer: '#loginContainer'
        },
        control: {
            loginButton: {
                tap: 'onLoginButtonTap'
            }
        },
        routes: {
            'login': 'showLogin'
        },

        loginUrl: 'https://accounts.google.com/o/oauth2/auth'
    },

    showLogin: function() {
        this.getMainTabPanel().setActiveItem(this.getLoginContainer());
    },

    onLoginButtonTap: function() {
        this.redirectTo(getLoginUrl());
    }
});