/**
 * A Legislators Bio, including a mug shot and other general information such as contact info
 */
Ext.define('GeoCon.view.legislator.Bio', {
    extend: 'Ext.Container',

    id: 'legislatorBio',

    config: {

        tpl: Ext.create('Ext.XTemplate',
            '<span class="legislator-pic" style="background-image: url(http://www.govtrack.us/data/photos/{govtrack_id}-50px.jpeg);"></span>',
            '<div class="legislator-name">',
                '<div class="title">{title} {firstname} {middlename} {lastname} ({party})</div>',
                '<div class="district">{state} {district: this.ordinal}</div>',
            '</div>',

            '<div class="x-list-normal"><div class="x-list-header">Contact Info</div></div>',
            '<div class="legislator-info">',
                'Phone: {[this.notAvailable(values.phone)]}<br />',
                'Email: {[this.notAvailable(values.email)]}<br />',
                'Website: {[this.notAvailable(values.website)]}',
            '</div>',

            '<div class="x-list-normal"><div class="x-list-header">Committee Assignments</div></div>',
            {
                notAvailable: function(value) {
                    return value ? value : 'Not Available';
                },
                emailNotAvailable: function(value) {
                    return value ? '<a href="mailto:' + value + '">' + value + '</a>' : 'Not Available';
                },
                siteNotAvailable: function(value) {
                    return value ? '<a href="' + value + '">' + value + '</a>' : 'Not Available';
                },
                ordinal: function(value) {
                    if (isNaN(parseInt(value, 10))) {
                        return value;
                    }
                    var endings = ['th', 'st', 'nd', 'rd'],
                        digit = value % 10;

                    if (value === 0) {
                        return 'At-large District';
                    }
                    else if (digit > 3 || (value > 10 && value < 20)) {
                        return value + 'th District';
                    }
                    else {
                        return value + endings[digit] + ' District';
                    }
                }
            }
        )
    }
});
