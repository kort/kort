Ext.define('Device.view.contacts.Detail', {
    extend: 'Ext.Container',

    config: {
        title: 'Information',
        scrollable: true,
        tpl: [
            '<div class="person">',

                '<div class="thumbnail" style="background-image:url({thumbnail});"></div>',
                '<div class="name">{first} {last}</div>',
                '<div class="company">{company}</div>',

                '<tpl if="phones">',
                '<ul>',
                '<table cellpadding="0" cellspacing="0">',
                    '{% for (val in values.phones) { %}',
                        '<tr>',
                            '<td><span>{[val]}</span></td>',
                            '<td width="100%">{[values.phones[val]]}</td>',
                        '</tr>',
                    '{% } %}',
                '</table>',
                '</ul>',
                '</tpl>',

                '<tpl if="emails">',
                '<ul>',
                '<table cellpadding="0" cellspacing="0">',
                    '{% for (val in values.emails) { %}',
                        '<tr>',
                            '<td><span>{[val]}</span></td>',
                            '<td width="100%">{[values.emails[val]]}</td>',
                        '</tr>',
                    '{% } %}',
                '</table>',
                '</ul>',
                '</tpl>',

                '<tpl if="urls">',
                '<ul>',
                '<table cellpadding="0" cellspacing="0">',
                    '{% for (val in values.urls) { %}',
                        '<tr>',
                            '<td><span>{[val]}</span></td>',
                            '<td width="100%">{[values.urls[val]]}</td>',
                        '</tr>',
                    '{% } %}',
                '</table>',
                '</ul>',
                '</tpl>',

                '<tpl if="addresses">',
                '<ul>',
                '<table cellpadding="0" cellspacing="0">',
                    '{% for (val in values.addresses) { %}',
                        '<tr>',
                            '<td><span>{[val]}</span></td>',
                            '<td width="100%">',
                                '{[values.addresses[val].Street]}</br >',
                                '{[values.addresses[val].City]}, {[values.addresses[val].State]}</br >',
                                '{[values.addresses[val].ZIP]}</br >',
                            '</td>',
                        '</tr>',
                    '{% } %}',
                '</table>',
                '</ul>',
                '</tpl>',

            '</div>'
        ].join('')
    }
});
