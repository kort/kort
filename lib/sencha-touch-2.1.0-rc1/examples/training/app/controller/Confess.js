Ext.define('CrimeFinder.controller.Confess', {
	extend : 'Ext.app.Controller',
	requires : ['Ext.device.Device','Ext.device.Camera'],
	config : {
		models: [
		  'Confession'
		],
		refs : {
			'speedField'  	: 'confessform spinnerfield',
			'addressField' 	: 'confessform textfield[name="address"]',
			'confessForm' 	: 'confessform',
			'photoField' 	: 'confessform hiddenfield[name=crimescenephoto]',
			'photoButton' 	: 'confessform button[action=photo]',
			'saveButton' 	: 'confessform button[action=save]',
			'offenseField' 	: 'confessform selectfield[name=offense]',
			'currentLocationField' : 'confessform checkboxfield[name=currentLocation]'
		},
		control : {

			'offenseField' : {
				change : 'offenseChange'
			},
			
			'currentLocationField' : {
				check : 'currentLocationCheck',
				uncheck : 'currentLocationCheck'
			},
			
			'saveButton' : {
				tap : 'onSaveTap'
			},

			'photoButton' : {
				tap : 'onPhotoTap'
			},

			'confessForm' : {
				 activate : 'onConfessFormActivate'
			}

		}

	},

	onConfessFormActivate : function(obj) {
		if(Ext.device.Device.name != 'not available') {
			this.getPhotoButton().show();
		}
	},
	
	onPhotoTap : function(b, e) {
		var me = this;
		Ext.device.Camera.capture({
			success : function(image) {
			  me.getPhotoField().setValue(image);
			  // Ext.Msg.alert("Image Size","Your image is " + image.length + " characters");
			},
			source: 'camera',
			quality : 75,
			width : 300,
			height : 300,
			destination : 'data'
		});
	},
	
	offenseChange : function(obj, newModel, oldModel) {

		if(newModel.get('value') == 3) {
			this.getSpeedField().show();
		} else {
			this.getSpeedField().hide();
		}
	},
	currentLocationCheck : function(obj) {
		if(!obj.isChecked()) {
			this.getAddressField().show();
		} else {
			this.getAddressField().hide();
		}
	},
	onSaveTap : function(b, e) {
		var model = Ext.create("CrimeFinder.model.Confession", {});
		var errorstring = "";
		this.getConfessForm().updateRecord(model);
		var errors = model.validate();
		if(!errors.isValid()) {
			errors.each(function(errorObj) {
				errorstring += errorObj.getMessage() + "<br />";
			});
			Ext.Msg.alert("Doh!", errorstring);
		} else {
			// step 2
			
			  var formdata = this.getConfessForm().getValues();
			  formdata.method = "saverecord";
			  
			  
			  if (formdata.crimescenephoto == null) 
			  {
			  Ext.data.JsonP.request({
			  	url: 'http://senchatraining.com/ftst2/components/confession.cfc',
			    params: formdata,
			    success: function() {
			    	 Ext.Msg.alert("Success!","Don't you feel better now?");
			    },
			    failure: function(error) {
			    	 Ext.Msg.alert("Doh!",error);
			    },
			    scope: this
			  });
			  } else {
			  	 this.getConfessForm().submit(
			  	{ 
			  	 url: 'http://senchatraining.com/ftst2/components/confession.cfc?method=saveconfessionform',
			     method: 'post', 
			     submitDisabled: true, 
			     waitMsg: 'Saving Data..please wait', 
			     success: function(objForm,httpRequest) { 
			     	 Ext.Msg.alert("Record Saved","Please pay a fine."); 
			     	 objForm.reset(); 
			     },
			     failure: function(error) {
			     	Ext.Msg.alert("Error", error);
			     	console.log(arguments);
			     }
			   });
			  }
			 
			/*
			model.save({
				success : function(record, operation) {
					Ext.Msg.alert("Thank you", "You are a good egg");
				},
				failure : function(objForm, httpRequest) {
					Ext.Msg.alert("Fail","Your form post failed");
				}
			});
			*/
			
		}
	}
});
