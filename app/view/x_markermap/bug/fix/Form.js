/**
 * Answer form for fix view
 */
Ext.define('Kort.view.markermap.bug.fix.Form', {
	extend: 'Ext.Container',
	alias: 'widget.fixform',
    requires: [
        'Ext.form.Panel',
        'Ext.Button',
        'Ext.field.Select',
        'Ext.field.Number',
        'Ext.field.Text',
        'Kort.view.markermap.bug.fix.type.Select'
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
            tpl:    new Ext.XTemplate(
                        '<div class="fix-content">',
                            '<div class="textpic">',
                                '<div class="image">',
                                    '<img class="koin-image" src="./resources/images/koins/koin_no_value.png" />',
                                '</div>',
                                '<div class="content">',
                                    '<p>',
                                        '<tpl if="this.isCampaign(campaign_id)">',
                                            '{[this.getMessage("fix.form.koins.earncamp", {fix_koin_count: values.fix_koin_count, extra_coins: values.campaign_extra_coins})]}',
                                        ' <tpl else>',
                                            '{[this.getMessage("fix.form.koins.earn", {fix_koin_count: values.fix_koin_count})]}',
                                        '</tpl>',
                                    '</p>',
                                '</div>',
                            '</div>',
                            '<div class="textpic">',
                                '<div class="image">',
                                    '<img class="missiontype-image" src="{[this.constructMissiontypeIcon(values.type,values.campaign_id)]}" />',
                                '</div>',
                                '<div class="content">',
                                    '<p>{description}</p>',
                                '</div>',
                            '</div>',
                        '</div>',

                {
                    //member functions:
                    isCampaign: function(campaign_id) {
                        if(campaign_id) {
                            return true;
                        }else {
                            return false;
                        }
                    },
                    constructMissiontypeIcon: function(type,campaign_id) {
                        var state = Kort.util.Config.getMissionState().bug;
                        if(campaign_id) {
                            state = Kort.util.Config.getMissionState().bugCampaign;
                        }
                        return Kort.util.Config.constructMissionIconURL(type,state,true);
                    }
                }
                
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
            
            fixField = Ext.create('Kort.view.markermap.bug.fix.type.Select', fieldConfig);
        } else if(bug.get('view_type') === 'number') {
            fixField = Ext.create('Ext.field.Number', fieldConfig);
        } else {
            fixField = Ext.create('Ext.field.Text', fieldConfig);
        }
        
        fixField.setPlaceHolder(this.getRecord().get('answer_placeholder'));
        
        return fixField;
    }
});
