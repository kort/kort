/**
 * @aside guide forms
 *
 * The text field is the basis for most of the input fields in Sencha Touch. It provides a baseline of shared
 * functionality such as input validation, standard events, state management and look and feel. Typically we create
 * text fields inside a form, like this:
 *
 *     @example
 *     Ext.create('Ext.form.Panel', {
 *         fullscreen: true,
 *         items: [
 *             {
 *                 xtype: 'fieldset',
 *                 title: 'Show us your picture',
 *                 items: [
 *                     {
 *                         xtype: 'filefield',
 *                         label: 'Image',
 *                         name: 'image'
 *                     }
 *                 ]
 *             }
 *         ]
 *     });
 *
 * This creates a file field inside a form. File Fields can also be created outside of a Form, like this:
 *
 *     Ext.create('Ext.ux.field.File', {
 *         label: 'Image',
 *         name: 'image'
 *     });
 *
 * ## Configuring
 *
 * File field inherits from {@link Ext.field.Field}, which is the base class for all fields in Sencha Touch and provides
 * a lot of shared functionality for all fields, including setting values, clearing and basic validation. See the
 * {@link Ext.field.Field} documentation to see how to leverage its capabilities.
 */
Ext.define('Ext.ux.field.File', {
    extend: 'Ext.field.Field',
    xtype: 'filefield',
    requires: [
        'Ext.ux.field.FileInput'
    ],

    /**
     * @event focus
     * Fires when this field receives input focus
     * @param {Ext.ux.field.File} this This field
     * @param {Ext.event.Event} e
     */

    /**
     * @event blur
     * Fires when this field loses input focus
     * @param {Ext.ux.field.File} this This field
     * @param {Ext.event.Event} e
     */

    /**
     * @event mousedown
     * Fires when this field receives a mousedown
     * @param {Ext.ux.field.File} this This field
     * @param {Ext.event.Event} e
     */

    /**
     * @event change
     * Fires just before the field blurs if the field value has changed
     * @param {Ext.ux.field.File} this This field
     * @param {Mixed} newValue The new value
     * @param {Mixed} oldValue The original value
     */

    /**
     * @event action
     * @preventable doAction
     * Fires whenever the return key or go is pressed. FormPanel listeners
     * for this event, and submits itself whenever it fires. Also note
     * that this event bubbles up to parent containers.
     * @param {Ext.ux.field.File} this This field
     * @param {Mixed} e The key event object
     */

    config: {
        /**
         * @cfg
         * @inheritdoc
         */
        ui: 'file',

        /**
         * @cfg {Object} component The inner component for this field, which defaults to an input text.
         * @accessor
         */
        component: {
            xtype: 'fileinput'
        },

        bubbleEvents: ['action']
    },

    // @private
    initialize: function() {
        var me = this;

        me.callParent();

        me.getComponent().on({
            scope: this,

            keyup       : 'onKeyUp',
            change      : 'onChange',
            focus       : 'onFocus',
            blur        : 'onBlur',
            mousedown   : 'onMouseDown'
        });

        // set the originalValue of the textfield, if one exists
        me.originalValue = me.originalValue || "";
        me.getComponent().originalValue = me.originalValue;

        me.syncEmptyCls();
    },
    
    syncEmptyCls: function() {
        var empty = (this._value) ? this._value.length : false,
            cls = Ext.baseCSSPrefix + 'empty';

        if (empty) {
            this.removeCls(cls);
        } else {
            this.addCls(cls);
        }
    },

    // @private
    updateValue: function(newValue) {
        var component  = this.getComponent(),
            // allows newValue to be zero but not undefined, null or an empty string (other falsey values)
            valueValid = newValue !== undefined && newValue !== null && newValue !== '';

        if (component) {
            component.setValue(newValue);
        }

        this.syncEmptyCls();
    },

    getValue: function() {
        var me = this;

        me._value = me.getComponent().getValue();

        me.syncEmptyCls();

        return me._value;
    },

    // @private
    updateInputType: function(newInputType) {
        var component = this.getComponent();
        if (component) {
            component.setType(newInputType);
        }
    },

    // @private
    updateName: function(newName) {
        var component = this.getComponent();
        if (component) {
            component.setName(newName);
        }
    },

    // @private
    updateTabIndex: function(newTabIndex) {
        var component = this.getComponent();
        if (component) {
            component.setTabIndex(newTabIndex);
        }
    },

    /**
     * Updates the {@link #inputCls} configuration on this fields {@link #component}
     * @private
     */
    updateInputCls: function(newInputCls, oldInputCls) {
        var component = this.getComponent();
        if (component) {
            component.replaceCls(oldInputCls, newInputCls);
        }
    },

    doSetDisabled: function(disabled) {
        var me = this;

        me.callParent(arguments);

        var component = me.getComponent();
        if (component) {
            component.setDisabled(disabled);
        }

        if (disabled) {
            me.hideClearIcon();
        } else {
            me.showClearIcon();
        }
    },

    doAction: function() {
        this.blur();
    },

    onChange: function(me, value, startValue) {
        console.log('onchange');
        me.fireEvent('change', this, value, startValue);
    },

    onFocus: function(e) {
        this.isFocused = true;
        this.fireEvent('focus', this, e);
    },

    onBlur: function(e) {
        var me = this;

        this.isFocused = false;

        me.fireEvent('blur', me, e);

        setTimeout(function() {
            me.isFocused = false;
        }, 50);
    },

    onMouseDown: function(e) {
        this.fireEvent('mousedown', this, e);
    },

    /**
     * Attempts to set the field as the active input focus.
     * @return {Ext.ux.field.File} This field
     */
    focus: function() {
        this.getComponent().focus();
        return this;
    },

    /**
     * Attempts to forcefully blur input focus for the field.
     * @return {Ext.ux.field.File} This field
     */
    blur: function() {
        this.getComponent().blur();
        return this;
    },

    /**
     * Attempts to forcefully select all the contents of the input field.
     * @return {Ext.ux.field.File} this
     */
    select: function() {
        this.getComponent().select();
        return this;
    },

    reset: function() {
        this.getComponent().reset();

        //we need to call this to sync the input with this field
        this.getValue();

        this[this._value ? 'showClearIcon' : 'hideClearIcon']();
    },

    isDirty: function() {
        var component = this.getComponent();
        if (component) {
            return component.isDirty();
        }
        return false;
    }
});