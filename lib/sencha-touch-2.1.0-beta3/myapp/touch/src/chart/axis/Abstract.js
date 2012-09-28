/**
 * @class Ext.chart.axis.Abstract
 *
 * An abstract axis class extended by Numeric, Category and Radial axes.
 */
Ext.define('Ext.chart.axis.Abstract', {

    xtype: 'axis',

    mixins: {
        observable: 'Ext.mixin.Observable'
    },
    
    config: {
        /**
         * @cfg {String} position
         * Where to set the axis. Available options are `left`, `bottom`, `right`, `top`.
         */
        position: 'bottom',
        
        /**
         * @cfg {Array} fields
         * An array containing the names of the record fields which should be mapped along the axis.
         */
        fields: [],

        /**
         * @cfg {String} labelTitle
         *
         * The title for the axis.
         */
        labelTitle: {},

        /**
         * @cfg {Object} label
         *
         * The label configuration object for the Axis. This object may include style attributes
         * like `spacing`, `padding`, `font`, and a `renderer` function that receives a string or number and
         * returns a new string with the modified values.
         */
        label: {},

        /**
         * @cfg {Object} grid
         * The grid configuration object for the Axis style. Can contain `stroke` or `fill` attributes.
         * Also may contain an `odd` or `even` property in which you only style things on odd or even rows.
         * For example:
         *
         *
         *     grid {
         *         odd: {
         *             stroke: '#555'
         *         },
         *         even: {
         *             stroke: '#ccc'
         *         }
         *     }
         */
        grid: {},

        chart: null,

        steps: 10,

        hidden: false
    },

    observableType: 'component',
    
    constructor: function (config) {
        var me = this;
        this.labels = [];
        this.initConfig(config);
        me.getId();
        me.mixins.observable.constructor.apply(me, arguments);
        Ext.ComponentManager.register(me);
    },
    
    applyPosition: function (pos) {
        return pos.toLowerCase();
    },

    applyLabel: function (newText, oldText) {
        if (!oldText) {
            oldText = new Ext.draw.sprite.Text({});
        }
        oldText.setAttributes(newText);
        return oldText;
    },

    /**
     * @private get the surface for drawing the series sprites
     */
    getSurface: function () {
        return this.surface || (this.surface = this.getChart().getSurface(this.getId() + '-surface'));
    },

    
    hideLabels: function () {
        this.getSprites()[0].setDirty(true);
        this.setLabel({hidden: true});
    },

    showLabels: function () {
        this.getSprites()[0].setDirty(true);
        this.setLabel({hidden: false});
    },

    
    /**
     * @private Reset the axis to its original state, before any user interaction.
     */
    reset: function () {
        this.clearTransform();
    },
    
    /**
     * Invokes renderFrame on this axis's surface(s)
     */
    renderFrame: function () {
        this.getSurface().renderFrame();
    },

    // Methods used in ComponentQuery and controller

    //
    getItemId: function () {
        return this.getId();
    },

    getAncestorIds: function () {
        return [this.getChart().getId()];
    },

    isXType: function (xtype) {
        return xtype === 'axis';
    },

    destroy: function () {
        Ext.ComponentManager.unregister(this);
        this.callSuper();
    }
});

