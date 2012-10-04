//<debug>
Ext.Loader.setPath({
    'Ext': '../../src'
});
//</debug>

Ext.define('File', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            {name: 'id',       type: 'string'},
            {name: 'fileName', type: 'string'}
        ]
    }
});

Ext.define('Example.SourceView', {
    extend: 'Ext.Panel',
    xtype: 'sourceview',
    config: {
        cls: 'ux-code',
        styleHtmlContent: true,
        scrollable: true
    },
    applyHtml: function(html) {
        this.matches = [];

        var v   = html,
            fmt = '<span class="ux-code-{0}">{1}</span>';

        var between = Ext.Function.bind(function(idx, length) {
            for (var i = 0; i < this.matches.length; i++){
                var m = this.matches[i],
                    s = m[0],
                    e = m[1];
                /*if (s <= idx && (idx + length) <= e){
                    return true;
                }*/
                if ((s <= idx && idx < e) || (s < (idx + length) && (idx + length) <= e)){
                    return true;
                }
            }
            return false;
        }, this);

        var highlight = Ext.Function.bind(function(str, regex, cls, fn){
            regex.compile(regex);
            var match;

            while (match = regex.exec(str)) {
                var mdata = fn ? fn(match) : [match.index, match[0]],
                    midx = mdata[0],
                    mstr = mdata[1];
                if (!between(midx, mstr.length)){
                    var replacement = Ext.util.Format.format(fmt, cls, mstr),
                        diff = (replacement.length - mstr.length);
                    str = str.slice(0, midx) + replacement + str.slice(midx + mstr.length);
                    regex.lastIndex = midx + replacement.length;
                    for (var i = 0; i < this.matches.length; i++){
                        var m = this.matches[i];
                        if (m[1] < midx) continue;

                        m[0] += diff;
                        m[1] += diff;
                    }
                    this.matches.push([midx, regex.lastIndex]);
                }
            }
            return str;
        }, this);

        // Escape HTML...whatever
        var htmlRE = /<(\w+)>/ig, match;
        while (match = htmlRE.exec(v)) {
            v = v.slice(0, match.index) + Ext.util.Format.format('&lt;{0}&gt;', match[1]) + v.slice(match.index + match[0].length);
        }

        // Block comments
        v = highlight(v, /\/\*(.|\s)*?\*\//ig, 'comment');

        // String literals
        v = highlight(v, (/("|')[^\1\n\r]*?\1/ig), 'string');

        // Line comments
        v = highlight(v, /\/\/[^\n\r]*/ig, 'comment');

        // Integers and Floats
        v = highlight(v, /\d+\.?\d*/ig, 'number');

        // Function names
        v = highlight(v, /(\w+)\s*\:\s*function/ig, 'function', function(match){
            return [match.index, match[1]];
        });
        v = highlight(v, /function (\w+)/ig, 'function', function(match){
            return [match.index + 9, match[1]];
        });

        // Keywords
        v = highlight(v, /\b(this|function|null|return|true|false|new|int|float|break|const|continue|delete|do|while|for|in|switch|case|throw|try|catch|typeof|instanceof|var|void|with|yield|if|else)\b/ig, 'keyword');

        // Operators
        v = highlight(v, /\.|\,|\:|\;|\=|\+|\-|\&|\%|\*|\/|\!|\?|\<|\>|\||\^|\~/ig, 'operator');

        return '<pre>' + v + '</pre>';
    }
});

Ext.application({
    startupImage: {
        '320x460': 'resources/startup/Default.jpg', // Non-retina iPhone, iPod touch, and all Android devices
        '640x920': 'resources/startup/640x920.png', // Retina iPhone and iPod touch
        '640x1096': 'resources/startup/640x1096.png', // iPhone 5 and iPod touch (fifth generation)
        '768x1004': 'resources/startup/768x1004.png', //  Non-retina iPad (first and second generation) in portrait orientation
        '748x1024': 'resources/startup/748x1024.png', //  Non-retina iPad (first and second generation) in landscape orientation
        '1536x2008': 'resources/startup/1536x2008.png', // : Retina iPad (third generation) in portrait orientation
        '1496x2048': 'resources/startup/1496x2048.png' // : Retina iPad (third generation) in landscape orientation
    },

    isIconPrecomposed: false,
    icon: {
        57: 'resources/icons/icon.png',
        72: 'resources/icons/icon@72.png',
        114: 'resources/icons/icon@2x.png',
        144: 'resources/icons/icon@144.png'
    },

    requires: [
        'Ext.data.TreeStore',
        'Ext.NestedList',
        'Ext.TitleBar'
    ],

    launch: function() {
        var store = Ext.create('Ext.data.TreeStore', {
            model: 'File',
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: 'source.json'
            }
        });

        Ext.create('Ext.NestedList', {
            fullscreen: true,
            title: 'src/',
            displayField: 'fileName',
            // add a / for folder nodes in title/back button
            getTitleTextTpl: function() {
                return '{' + this.getDisplayField() + '}<tpl if="leaf !== true">/</tpl>';
            },
            // add a / for folder nodes in the list
            getItemTextTpl: function() {
                return '{' + this.getDisplayField() + '}<tpl if="leaf !== true">/</tpl>';
            },
            // provide a codebox for each source file
            detailCard: new Example.SourceView(),
            store: store,
            listeners: {
                leafitemtap: function(me, list, index, item, e) {
                    var store = list.getStore(),
                        record  = store.getAt(index),
                        detailCard = me.getDetailCard();

                    list.setMasked({
                        xtype: 'loadmask',
                        message: 'Loading'
                    });

                    Ext.Ajax.request({
                        url: '../../src/' + record.get('id'),
                        success: function(response) {
                            detailCard.setHtml(response.responseText);
                            list.unmask();
                        },
                        failure: function() {
                            detailCard.setHtml("Loading failed.");
                            list.unmask();
                        }
                    });

                }
            }
        });
    }
});
