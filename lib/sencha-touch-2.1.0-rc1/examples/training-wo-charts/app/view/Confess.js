Ext.define("CrimeFinder.view.Confess", {
	extend : 'Ext.form.Panel',
	xtype : 'confessform',
	requires: [
	  'Ext.form.FieldSet',
	  'Ext.field.Email',
	  'Ext.field.Select',
	  'Ext.field.Spinner',
	  'Ext.field.DatePicker',
	  'Ext.field.Hidden'
	],
	config : {
		
		items : [{
			xtype : 'fieldset',
			title : 'About me',
			defaults: {
				xtype: 'textfield',
				labelWidth: '110px'
			},
			items : [{
				name : 'lname',
				label : 'Last Name',
				required : true,
				autoCapitalize: true
				
			}, {
				name : 'fname',
				label : 'First Name',
				required : true,
				autoCapitalize: true
			}, {
				xtype : 'emailfield',
				name : 'email',
				label : 'E-mail',
				required : true
			},
			{
				xtype: 'textfield',
				name: 'tel',
				label: 'Tel:',
				component: {type: 'tel'}
			}
			
			]
		}, {
			xtype : 'fieldset',
			title : 'Offense',
			items : [{
				xtype : 'selectfield',
				name : 'offense',
				options : CrimeFinder.config.Constants.offenses
			}, 
			
			{
				xtype : 'datepickerfield',
				name : 'offensedate',
				label : 'Date',
				required : true,
				value : new Date(),
				picker: {
				  yearFrom: 2009, 
				  yearTo: 2020 
				}
			}
			,
			
			 {
				xtype : 'checkboxfield',
				name : 'currentLocation',
				label : 'At Current Location?',
				labelWidth: '170px',
				value : 1,
				checked : true
			}, {
				xtype : 'textfield',
				name : 'address',
				label : 'Address',
				hidden : true
			},
			 {
				xtype : 'spinnerfield',
				name : 'speed',
				label : 'Top Speed (MPH)',
				labelWidth: '170px',
				increment : 5,
				hidden: true,
				value : 25,
				cycle : true,
				minValue: 15,
				maxValue: 120
			},
			{
				xtype: 'textareafield',
				name: 'description',
				placeHolder: 'Describe your Offense',
				maxRows: 4
			},
			
			{
				xtype: 'hiddenfield',
				name: 'crimescenephoto'
			}
			
			]

		},
		
		{
			xtype: 'container',
			layout: 'hbox',
			items: [
			    // step 2
				{
				xtype : 'button',
				action: 'photo',
				text : 'Take Photo',
				flex: 1,
				hidden: true
				},
			
				{
				xtype : 'button',
				action: 'save',
				text : 'Submit', 
				flex: 1
				}
			]
		}
	 ]
	}
});
