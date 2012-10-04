Ext.define("CrimeFinder.view.news.confess.Detail", {
    extend: 'Ext.carousel.Carousel',
    xtype: 'confessdetail',
    config: {
    	data: null
    },
    initialize: function() {
    	this.setItems([
    	{
    		xtype: 'container',
    		defaults: {
    			xtype: 'textfield',
    			readOnly: true	
    		},
    		items: [
    		{
    			label: "Name:",
    			value: this.getData().lname + ', ' + this.getData().fname
    			
    		},
    		{
				xtype : 'selectfield',
				name : 'offense',
				label: 'Offense:',
				value: this.getData().offense,
				options : [{
					text : 'Jaywalking',
					value : 1
				}, {
					text : 'Littering',
					value : 2
				}, {
					text : 'Speeding',
					value : 3
				}]
			},
    		{
    			label: 'E-mail:',
    			value: this.getData().email
    		},
    		{
    			xtype: 'textareafield',
    			label: 'Desc:',
    			value: this.getData().description
    		}
    		]
    		
    	},
    	{
    		xtype: 'img',
    		cls: 'crimescenephoto',
    		src: 'data:image/gif;base64,' + this.getData().crimescenephoto
    	}
    	
    	]);
    }
});