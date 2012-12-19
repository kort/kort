/**
 * 
 
 */
Ext.define('patch.AjaxProxy', {
	override: 'Ext.data.proxy.Ajax',
	
	/**
	 * @override
	 */
	createRequestCallback: function(request, operation, callback, scope) {
        var me = this;
        
        return function(options, success, response) {
            // Fix for PhoneGap: XHR to local files are made thru file:// protocol this means that
            // status code will be 0 indicating a success xhr request, if so we will check that responseText
            // is not empty to assume request is successful.
			success = success || (response.status === 0 && response.responseText !== "" );
            me.processResponse(success, operation, request, response, callback, scope);
        };
    }
});