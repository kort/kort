/**
 * @author Maximiliano Fierro (https://github.com/elmasse/Ext.i18n.Bundle-touch)
 * @class Ext.i18n.Bundle
 * @extends Ext.data.Store
 *
 */
Ext.define('Ext.i18n.Bundle', {
	extend: 'Ext.data.Store',
	xtype: 'bundle',

	singleton: true,

	requires: [
		'Ext.i18n.reader.Property',
		'Ext.i18n.model.Property'
	],

	//@private
	defaultLanguage: 'en',
	//@private
	resourceExt: '.props',

	//@private
	cExp: /\{([\w\-]+)(?:\:([\w\.]*)(?:\((.*?)?\))?)?\}/g,

	config:{
		/**
		 * @cfg bundle {String} bundle name for properties file. Default to message
		 */
		bundle: 'message',

		/**
		 * @cfg path {String} URI to properties files. Default to 'resources'
		 */
		path: 'resources',

		/**
		 * @cfg language {String} Language in the form xx-YY where:
		 * 		xx: Language code (2 characters lowercase)
    	 *      YY: Country code (2 characters upercase).
		 * Optional. Default to browser's language. If it cannot be determined default to 'en'.
		 */

		/**
		 * @cfg noCache {boolean} whether or not to disable Proxy's cache. Optional. Defaults to true.
		 */


		model: 'Ext.i18n.model.Property'
	},

	/**
     * @public
     * @method configure will initialize the bundle with the given configuration
     * @param config
     * @param config.path {String} URI to properties files. Default to 'resources'
     */
	configure: function(config){
		var me = this;

		me.setPath(config.path);
		me.setBundle(config.bundle);
        me.setNoCache(config.noCache);

		me.setLanguage(config.language || me.guessLanguage());

	},

	constructor: function(config){
		config = config || {};

		var me = this;
		Ext.applyIf(config, {
			proxy:{
				type: 'ajax',
				reader: {
					type: 'property'
				}
			},
			listeners:{
				'load': this.onBundleLoad,
				scope: this
			}
		});

		me.callParent([config]);
	},



    setNoCache: function(value){
        var me = this,
            proxy = me.getProxy();

        //avoid sending extra params
        proxy.getParams = Ext.emptyFn;

        proxy.setNoCache(value);
    },

	/**
	 * @private
	 */
	guessLanguage: function(){
		return (navigator.language || navigator.browserLanguage
				|| navigator.userLanguage || this.defaultLanguage);
	},

    /**
     * @public
     * @method message will create the markup as a placeholder for the message key and paramaters
     * @param key {String} the message key in the bundle file
     * @param obj {Object} Optional. If the key message contains parameterized holder i.e {prop}
     * obj will represent the data properties that fill out those holders i.e {prop: 'text'}
     */
	message: function(key, obj){
		var cKey = this.getContentKey(key),
			data = '';

		for(var p in obj){
			data+=' data-'+p+'="'+obj[p]+'"';
		}

		return '<span class="bundle '+cKey+'"' + data +'></span>';
	},

    /**
     * @public
     * @method getLanguage returns the current language
     * @return {String}
     */
	getLanguage: function(){
		return this.language;
	},

    /**
     * @public
     * @method setLanguage
     * @param lang {String} in the format:
     *  xx-YY where:
     *      xx: Language code (2 characters lowercase)
     *      YY: Country code (2 characters upercase).
     */
	setLanguage: function(lang){
		var me = this,
			proxy = this.getProxy();

		me.language = lang;
		proxy.on('exception', me.loadParent, me, {single: true});
		proxy.setUrl(me.buildURL(me.language));
		me.load();
	},

	/**
	 * @private
	 */
	onBundleLoad: function(store, records, success, op) {
		var me = this,
			str = ' .bundle{height:0 !important; width:0!important;}\n';
		if(success){
			Ext.Array.forEach(records, function(r, i){
				str += me.createContentLine(r);
			});
			me.appendRules(str);
		}
    },

	appendRules: function(str){
		var style = document.createElement('style'),
			sId = 'localized-css',//this.proxy.url,
			head = Ext.getHead(),
			el;

		el = Ext.get(sId);
		if(el) el.destroy();

		style.setAttribute('id', sId);
		style.innerHTML = str;

		head.appendChild(style);
	},


	/**
	 * @private
	 */
	onProxyLoad: function(op){
		if(op.getRecords()){
			this.callParent(arguments);
		}
	},

	/**
	 * @private
	 */
	buildURL: function(language){
		var me = this,
			url = '',
			path = me.getPath();

		if (path) url+= path + '/';
		url+=me.getBundle();
		if (language) url+= '_'+language;
		url+=this.resourceExt;
		return url;
	},

	/**
	 * @private
	 */
	loadParent: function(){
		this.getProxy().setUrl(this.buildURL());
		this.load();
	},

	/**
	 * @private
	 */
	formatLanguageCode: function(lang){
		var langCodes = lang.split('-');
		langCodes[0] = (langCodes[0]) ? langCodes[0].toLowerCase() : '';
		langCodes[1] = (langCodes[1]) ? langCodes[1].toUpperCase() : '';
		return langCodes.join('-');
	},

	createContentLine: function(record){
		var key = record.get('key'),
			value = record.get('value'),
			cKey;

		cKey = this.getContentKey(key);
		cValue = this.getContentValue(value);

		return '.' + cKey + ':after { content:' + cValue + ';}\n';
	},

	getContentKey: function(k){
		return 'bundle-'+k.replace(/\./g, '-');
	},

	getContentValue: function(v){
		var ret;
		function fn(m, n){
			return '\" attr(data-'+n+') \"';
		}
		ret = v.replace(this.cExp, fn);

		//ret = escape(ret).replace(/%/g, '\\0000');

		return '\"'+ret+'\"';
	}

});