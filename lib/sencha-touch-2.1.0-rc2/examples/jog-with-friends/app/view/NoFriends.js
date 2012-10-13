/**
 * This screen is displayed if the user has no friends.
 */
Ext.define('JWF.view.NoFriends', {
    extend: 'Ext.Container',

    config: {
        cls: 'noFriends',
        tpl: [
            '<div class="welcomeNoFriends">',
                '<img src="https://graph.facebook.com/{id}/picture?type=square" />',
                'Welcome to Jog with Friends, <b>{first_name}</b>!',
            '</div>'
        ]
    }
});
