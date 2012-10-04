/**
 * This is a tweet list item used in the TweetList view. It has several components:
 *
 *  - {@link #userName}: used to display the username of the tweet.
 *  - {@link #text}: used to display the text of the tweet
 *  - {@link #avatar}: used to displat the public avatarof the person who tweeted
 *  - {@link #retweets}: used to display the number of retweets, if specified
 */
Ext.define('Twitter.view.TweetListItem', {
    extend: 'Ext.dataview.component.ListItem',
    xtype : 'tweetlistitem',
    requires: [
        'Twitter.view.TweetListItemText',
        'Ext.Img'
    ],

    config: {
        // @inherit
        ui: 'tweet',

        /**
         * @inherit
         * The dataMap allows you to map {@link #record} fields to specific configurations in this component.
         *
         * For example, lets say you have a {@link #text} configuration which, when applied, gets turned into an instance of an Ext.Component.
         * We want to update the {@link #html} of this component when the 'text' field of the record gets changed.
         * As you can see below, it is simply a matter of setting the key of the object to be the getter of the config (getText), and then give that
         * property a value of an object, which then has 'setHtml' (the html setter) as the key, and 'text' (the field name) as the value.
         */
        dataMap: {
            // When the record is updated, get the {@link #text} configuration, and call {@link #setHtml} with the 'text' field of the record.
            getText: {
                setHtml: 'text'
            },

            // When the record is updated, get the {@link #userName} configuration, and call {@link #setHtml} with the 'from_user' field of the record.
            getUserName: {
                setHtml: 'from_user'
            },

            // When the record is updated, get the {@link #avatar} configuration, and call {@link #setSrc} with the 'profile_image_url' field of the record.
            getAvatar: {
                setSrc: 'profile_image_url'
            }
        },

        /**
         * @cfg {Object/Instance} userName
         * The component which displays the tweet posters username.
         */
        userName: {
            cls: 'username'
        },

        /**
         * @cfg {Object/Instance} text
         * The component which displays the tweets text.
         */
        text: {
            cls: 'text'
        },

        /**
         * @cfg {Object/Instance} retweets
         * The component which displays the number of retweets the tweet has, if the tweet is popular.
         * This is hidden by default, as not all tweets are popular.
         */
        retweets: {
            cls   : 'retweets',
            hidden: true
        },

        /**
         * @cfg {Object/Instance} avatar
         * The component which displays the avatar of the person who tweeted.
         * This uses the {@link Ext.Img} component to show the image.
         * It is docked to the left.
         */
        avatar: {
            docked: 'left',
            xtype : 'image',
            cls   : 'avatar',
            width: '48px',
            height: '48px'
        },

        /**
         * @inherit
         * The layout of this component is vbox, so we can show the username, tweet text, and retweets (if nessecarry) all vertically, which
         * still showing the avatar docked to the left.
         */
        layout: {
            type: 'vbox'
        }
    },

    /**
     * Applies the {@link #userName} configuration which will return an instance of Ext.Component
     */
    applyUserName: function(config) {
        return Ext.factory(config, Ext.Component, this.getUserName());
    },

    /**
     * Called when the {@link #userName} configuration has been updated. Inserts the component as the first child (so it is always at the top)
     */
    updateUserName: function(newUserName) {
        if (newUserName) {
            this.insert(0, newUserName);
        }
    },

    /**
     * Applies the {@link #text} configuration which will return an instance of Twitter.view.TweetListItemText. This is not a component because we
     * need to override setHtml to linkify URLs and wrap usernames + hashtags.
     */
    applyText: function(config) {
        return Ext.factory(config, Twitter.view.TweetListItemText, this.getText());
    },

    /**
     * Called when the {@link #text} configuration has been updated. Add the component into this item.
     */
    updateText: function(newText) {
        if (newText) {
            this.add(newText);
        }
    },

    /**
     * Applies the {@link #avatar} configuration. Returns an instance of Ext.Img
     */
    applyAvatar: function(config) {
        return Ext.factory(config, Ext.Img, this.getAvatar());
    },

    /**
     * Called when the {@link #avatar} confguration has been updated. Inserts the component into this item.
     */
    updateAvatar: function(newAvatar) {
        if (newAvatar) {
            this.add(newAvatar);
        }
    },

    /**
     * Applies the {@link #retweets} configuration. Returns an instance of Ext.Component
     */
    applyRetweets: function(config) {
        return Ext.factory(config, Ext.Component, this.getRetweets());
    },

    /**
     * Called when the {@link #retweets} confguration has been updated. Inserts the component into this item.
     */
    updateRetweets: function(newRetweets) {
        if (newRetweets) {
            this.add(newRetweets);
        }
    },

    updateTpl: Ext.emptyFn,
    /**
     * We must override the {@link #updateRecord} method in dataitem. This is so we can look at the records metadata field and check
     * if the tweet is popuplar, and if the tweet has retweets. If it is popular, it adds a custom className. If it has retweets, we
     * show the {@link #retweets} component, and update it's HTML.
     */
    updateRecord: function(newRecord) {
        this.callParent(arguments);

        if (!newRecord) {
            return;
        }

        var metadata = newRecord.get('metadata'),
            retweets = this.getRetweets();

        // ensure that the record has metadata + is a popular tweet
        if (metadata && metadata.result_type && metadata.result_type == "popular") {
            this.element.addCls('popular');

            //if there are retweets
            if (metadata.recent_retweets) {
                retweets.show();
                retweets.setHtml(metadata.recent_retweets + '+ recent retweets');
            }
        } else {
            //it isn't popular, so it can't have retweets. Remove the className + hide the retweets component
            this.element.removeCls('popular');
            retweets.hide();
        }
    }
});
