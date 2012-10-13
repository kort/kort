Ext.define('TouchStyle.controller.Category', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            main: 'main'
        },

        before: {
            showRootCategory: 'ensureStoreLoad',
            showCategoryById: 'ensureStoreLoad'
        },

        control: {
            main: {
                beforepop: 'onMainBeforePop'
            },
            categories: {
                itemtap: 'onCategoryTap'
            },
            productslist: {
                itemtap: 'onProductTap'
            }
        },

        routes: {
            '': 'showRootCategory',
            ':id': 'showCategoryById'
        },

        currentRecord: null,

        stack: []
    },

    init: function() {
        Ext.getStore('Categories').on('load', this.onStoreLoad, this);
    },

    ensureStoreLoad: function(action) {
        var store = Ext.getStore('Categories');

        if (store.data.all.length) {
            action.resume();
        } else {
            store.on('load', function() {
                action.resume();
            }, this, {
                single: true
            });
        }
    },

    onMainBeforePop: function() {
        var history = this.getApplication().getHistory(),
            record = this.getCurrentRecord().parentNode,
            urlId = (record && record.get('urlId')) ? record.get('urlId') : '',
            productView = this.productView,
            stack = this.getStack();

        this.setCurrentRecord(record);

        history.add(new Ext.app.Action({
            url: urlId
        }), true);

        stack.pop();
        this.setStack(stack);

        if (productView && !productView.isHidden()) {
            productView.hide();
        }
    },

    showRootCategory: function() {
        var stack = this.getStack();

        if (stack.length) {
            this.getMain().pop();
            return;
        }

        this.setStack([]);

        var store = Ext.getStore('Categories'),
            record = store.getRoot();

        this.addPreviousViews(record);
        this.showCategory(record);
    },

    onCategoryTap: function(view, index, target, record, e) {
        this.redirectTo(record);
    },

    showCategoryById: function(id) {
        var store = Ext.getStore('Categories'),
            stack = this.getStack(),
            previousStackItem = stack[stack.length - 2],
            records, record;

        if (previousStackItem && previousStackItem == id) {
            this.getMain().pop();
            return;
        }

        records = Ext.Array.filter(store.data.all, function(record) {
            if (record.get('urlId') == id) {
                return record;
            }
        }, this);

        record = records[0];
        if (record) {
            this.addPreviousViews(record);

            stack.push(id);
            this.setStack(stack);

            if (record.childNodes.length) {
                this.showCategory(record);
            } else {
                this.showProducts(record);
            }
        } else {
            Ext.Logger.warn('Category not found');
        }
    },

    addPreviousViews: function(record) {
        var parents = [],
            main = this.getMain(),
            layout = main.getLayout(),
            animation = layout.getAnimation(),
            stack = this.getStack(),
            ln, i, urlId;

        if (main.getInnerItems().length) {
            return;
        }

        while ((record = record.parentNode)) {
            parents.unshift(record);
        }

        layout.setAnimation(false);

        ln = parents.length;
        for (i = 0; i < ln; i++) {
            urlId = parents[i].get('urlId');
            if (urlId) {
                stack.push(urlId);
            }

            this.showCategory(parents[i]);
        }

        this.setStack(stack);

        setTimeout(function() {
            layout.setAnimation(animation);
        }, 50);
    },

    showCategory: function(record) {
        var isRoot = (record.get('id') == "root"),
            view;

        if (isRoot) {
            record.set('label', 'Categories');
        }

        this.setCurrentRecord(record);

        view = this.getCategoriesView({
            title: record.get('label'),
            cls: (isRoot) ? 'root' : null,
            data: record.childNodes
        });

        this.getMain().setActiveItem(view);
    },

    showProducts: function(record) {
        this.setCurrentRecord(record);

        var store = record.products();
        store.getProxy().setExtraParam('cat', record.get('urlId'));
        store.load();

        //empty the store before adding the new one
        var productsStore = this.productsView.getStore();
        if (productsStore) {
            productsStore.removeAll();
        }

        this.productsView.setStore(store);

        this.getMain().setActiveItem(this.productsView);
    },

    /**
     * Called when an item is tapped on.
     * This is overridden in the Tablet controller
     */
    onProductTap: Ext.emptyFn,

    /**
     * This creates and returns a new categories view, for when it is needed.
     * Ideally this should be improved at some point to only instansiate a max of 2 views
     * and then reuse the same views over again.
     * @param {Object} config The configuration for the view.
     * @return {TouchStyle.view.Categories} view
     */
    getCategoriesView: function(config) {
        return Ext.create('TouchStyle.view.Categories', config);
    },

    /**
     * This function is used to create and return a product view.
     * There is a different products view for both phone and tablet profiles, so we just have an emptyFn
     * in this base controller, and in the tablet/phone controller we will override this.
     * @param {Object} config The configuration for the view.
     * @return {Ext.Component} view
     */
    getProductsView: Ext.emptyFn,

    /**
     * This function is used to create and return a the product view.
     * There is a different product view for both phone and tablet profiles, so we just have an emptyFn
     * in this base controller, and in the tablet/phone controller we will override this.
     * @param {Object} config The configuration for the view.
     * @return {Ext.Component} view
     */
    getProductView: Ext.emptyFn
});
