/**
 * Answer form for fix view
 */
Ext.define('Kort.view.bugmap.fix.Form', {
	extend: 'Ext.Container',
	alias: 'widget.fixform',
    requires: [
        'Ext.form.Panel',
        'Ext.Button',
        'Ext.field.Select',
        'Ext.field.Number',
        'Ext.field.Text',
        'Kort.view.bugmap.fix.type.Select'
    ],
    
	config: {
		layout: 'vbox',
        cls: 'fixform',
        scrollable: true,
        title: Ext.i18n.Bundle.message('fix.form.title')
	},
    
    initialize: function () {
        var fixContentComponent,
            fixFormPanel,
            fixField;
        
        this.callParent(arguments);
        
        fixContentComponent = {
            xtype: 'component',
            cls: 'fixContentComponent',
            scrollable: false,
            record: this.getRecord(),
            tpl:    new Ext.Template(
                        '<div class="fix-content">',
                            '<div class="textpic">',
                                '<div class="image">',
                                    '<img class="koin-image" src="./resources/images/koins/koin_no_value.png" />',
                                '</div>',
                                '<div class="content">',
                                    '<p>',
                                        Ext.i18n.Bundle.message('fix.form.koins.earn'),
                                        ' <span class="important">{fix_koin_count}</span> ',
                                        Ext.i18n.Bundle.message('fix.form.koins.name'),
                                    '</p>',
                                '</div>',
                            '</div>',
                            '<div class="textpic">',
                                '<div class="image">',
                                    '<img class="bugtype-image" src="./resources/images/marker_icons/{type}.png" />',
                                '</div>',
                                '<div class="content">',
                                    '<p>{description}</p>',
                                '</div>',
                            '</div>',
                        '</div>'
                    )
        };
        
        fixField = this.createFixField(this.getRecord());
        
        fixFormPanel = {
            xtype: 'formpanel',
            cls: 'fixFormPanel',
            scrollable: false,
            items: [
                {
                    xtype: 'togglefield',
                    name : 'falsepositive',
                    label: Ext.i18n.Bundle.message('fix.form.falsepositive.toggle.label'),
                    labelWidth: '60%'
                },
                fixField,
                {
                    xtype: 'button',
                    cls: 'fixSubmitButton',
                    ui: 'confirm',
                    text: Ext.i18n.Bundle.message('fix.form.button.submit')
                }
            ]
        };
        
        this.add([fixContentComponent, fixFormPanel]);
    },
    
    createFixField: function(bug) {
        var fixField,
            fieldConfig = {
                name: 'fixfield',
                cls: 'fixfield',
                hideAnimation: { type: 'fadeOut', duration: 500},
                showAnimation: { type: 'fadeIn', duration: 500}
            };
        
        if(bug.get('view_type') === 'select') {
            fieldConfig = Ext.merge(fieldConfig, {
                type: bug.get('type')
            });
            
            fixField = Ext.create('Kort.view.bugmap.fix.type.Select', fieldConfig);
        } else if(bug.get('view_type') === 'number') {
            fixField = Ext.create('Ext.field.Number', fieldConfig);
        } else {
            fixField = Ext.create('Ext.field.Text', fieldConfig);
        }
        
        fixField.setPlaceHolder(this.getRecord().get('answer_placeholder'));
        
        return fixField;
    }
});
