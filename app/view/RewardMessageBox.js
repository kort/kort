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
                                Ext.i18n.Bundle.message('reward.alert.koins.1') +
                                ' <span class="important">{koins}</span> ' +
                                Ext.i18n.Bundle.message('reward.alert.koins.2') +
                            '</p>',
                        '</div>',
                    '</div>',
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
                '</div>'
            )
    }
});
