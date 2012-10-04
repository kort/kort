Ext.define("CrimeFinder.model.Confession", {
	extend : 'Ext.data.Model',
	config : {
		idProperty : 'idcrimereport',
		fields : [{
			name : "idcrimereport",
			type : 'int'
		}, "lname", "fname", {
			name : "email",
			type : 'string',
			convert : function(value, record) {
				if(value === '') {
					var sEmail = Ext.String.format("{0}{1}@gmail.com", record.get('fname').charAt(0), record.get('lname'));
					return sEmail.toLowerCase();
				} else {
					return value;
				}
			}
		}, "offense", {
			name : 'offensedate',
			type : 'string'
		}, {
			name : 'currentlocation',
			type : 'boolean'
		}, "address", "crimescenephoto","description"],

		validations : [{
			type : 'presence',
			field : 'lname',
			message : 'Last name is required'
		}, {
			type : 'presence',
			field : 'fname',
			message : 'First name is required'
		}, {
			type : 'presence',
			field : 'offensedate',
			message : 'The date of the offense is required'
		}, {
			type : 'inclusion',
			field : 'offense',
			list : [1, 2, 3],
			message : 'You must enter Jaywalking, Littering, or Speeding as the offense'
		}],

		proxy : {
			/*
			 type : 'ajax',
			 api : {
			 create : 'data/savereport.json?action=create',
			 read : 'data/savereport.json?action=read',
			 update : 'data/savereport.json?action=update',
			 destroy : 'data/savereport.json?action=destroy'
			 }
			 */
			type : 'jsonp',
			url : 'http://www.senchatraining.com/ftst2/components/confession.cfc?method=getrecords',
			reader: {
				type: 'json',
				rootProperty: 'ROWS',
				totalProperty: 'RESULTS',
				successProperty: 'SUCCESS'
			}
		}
	}
});
