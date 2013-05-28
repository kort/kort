/**
 * Answer form for fix view.
 */
Ext.define('Kort.view.map.mission.fix.Form', {
	extend: 'Ext.Container',
	alias: 'widget.fixform',
    requires: [
        'Kort.view.map.mission.fix.type.Select'
    ],
    
	config: {
		layout: 'vbox',
        cls: 'fixform',
        scrollable: true,
        title: Ext.i18n.Bundle.message('fix.form.title')
	},

    /**
     * @private
     */
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
                                        '<tpl if="this.isPromotion(promo_id)">',
                                            '{[this.getMessage("fix.form.koins.earnpromotion", {fix_koin_count: values.fix_koin_count, extra_coins: values.extra_coins})]}',
                                        ' <tpl else>',
                                            '{[this.getMessage("fix.form.koins.earn", {fix_koin_count: values.fix_koin_count})]}',
                                        '</tpl>',
                                    '</p>',
                                '</div>',
                            '</div>',
                            '<div class="textpic">',
                                '<div class="image">',
                                    '<img class="missiontype-image" src="{[this.constructMissiontypeIcon(values.type,values.promo_id,values.inOperationalRange)]}" />',
                                '</div>',
                                '<div class="content">',
                                    '<p>{description}</p>',
                                '</div>',
                            '</div>',
                        '</div>',

                {
                    //member functions:
                    isPromotion: function(promo_id) {
                        if(promo_id) {
                            return true;
                        }else {
                            return false;
                        }
                    },
                    constructMissiontypeIcon: function(type,promo_id,inOperationalRange) {
                        var state = Kort.util.Config.getMapMarkerState().mission;
                        if(promo_id) {
                            state = Kort.util.Config.getMapMarkerState().missionPromotion;
                        }
                        return Kort.util.Config.constructMissionIconURL(type,state,true,inOperationalRange);
                    }
                }
                
                    )
        };
        
        fixField = this._createFixField(this.getRecord());
        
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

    /**
     * @private
     * @param {Kort.model.Mission} mission
     * @returns {*}
     */
    _createFixField: function(mission) {
        var fixField,
            fieldConfig = {
                name: 'fixfield',
                cls: 'fixfield',
                hideAnimation: { type: 'fadeOut', duration: 500},
                showAnimation: { type: 'fadeIn', duration: 500}
            };
        
        if(mission.get('view_type') === 'select') {
            fieldConfig = Ext.merge(fieldConfig, {
                type: mission.get('type')
            });
            
            fixField = Ext.create('Kort.view.map.mission.fix.type.Select', fieldConfig);
        } else if(mission.get('view_type') === 'number') {
            fixField = Ext.create('Ext.field.Number', fieldConfig);
        } else {
            fixField = Ext.create('Ext.field.Text', fieldConfig);
        }
        
        fixField.setPlaceHolder(this.getRecord().get('answer_placeholder'));
        
        return fixField;
    }
});
