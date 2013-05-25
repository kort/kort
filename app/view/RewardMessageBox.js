/**
 * Reward messagebox to show rewards.
 */
Ext.define('Kort.view.RewardMessageBox', {
    extend: 'Kort.view.NotificationMessageBox',
    xtype: 'rewardmessagebox',

    config: {
        rewardTpl: new Ext.XTemplate(
                '<div class="messagebox-content">',
                    '<div class="textpic">',
                        '<div class="image">',
                            '<img class="koin-image" src="./resources/images/koins/koin_no_value.png" />',
                        '</div>',
                        '<div class="content">',
                            '<p>' +
                                '{[this.getMessage("reward.alert.koins.new", {koin_count_new: values.koin_count_new})]}',
                            '</p>',
                            '<p>' +
                                '{[this.getMessage("reward.alert.koins.total", {koin_count_total: values.koin_count_total})]}',
                            '</p>',
                        '</div>',
                    '</div>',
                    '<tpl if="this.hasBadges(badges)">',
                        '<div class="text">',
                            '<div class="content">',
                                '<h1> ' + Ext.i18n.Bundle.message('reward.alert.badges.title') + ' </h1>',
                                '<div class="badges">',
                                    '<tpl for="badges">',
                                        '<div class="badge">',
                                            '<img src="./resources/images/badges/{name}.png" />',
                                        '</div>',
                                    '</tpl>',
                                '</div>',
                                '</p>',
                            '</div>',
                        '</div>',
                    '</tpl>',
                '</div>',
                {
                    hasBadges: function(badges) {
                        return badges.length > 0;
                    }
                }
            )
    }
});
