/**
 * Reward messagebox to show rewards
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
                                Ext.i18n.Bundle.message('reward.alert.koins.new.1') +
                                ' <span class="important">{koin_count_new}</span> ' +
                                Ext.i18n.Bundle.message('reward.alert.koins.new.2') +
                            '</p>',
                            '<p>' +
                                Ext.i18n.Bundle.message('reward.alert.koins.total.1') +
                                ' <span class="important">{koin_count_total}</span> ' +
                                Ext.i18n.Bundle.message('reward.alert.koins.total.2') +
                            '</p>',
                        '</div>',
                    '</div>',
                    // TODO don't print badges message when no badges were won
                    //'<tpl if="badges.length &gt 0">',
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
                    //'</tpl>',
                '</div>'
            )
    }
});
