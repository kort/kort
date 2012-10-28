/**
 * @private
 */
Ext.define('Ext.ux.field.FileInput', {
    extend: 'Ext.field.Input',
    xtype : 'fileinput',

    cachedConfig: {
        /**
         * @cfg {String} type The type attribute for input fields -- e.g. radio, text, password, file (defaults
         * to 'text'). The types 'file' and 'password' must be used to render those field types currently -- there are
         * no separate Ext components for those.
         * @accessor
         */
        type: 'file'
    }
});