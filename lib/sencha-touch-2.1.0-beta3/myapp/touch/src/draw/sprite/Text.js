/**
 *
 */
Ext.define("Ext.draw.sprite.Text", {
    extend: "Ext.draw.sprite.Sprite",
    requires: ['Ext.draw.TextMeasurer'],
    alias: 'sprite.text',
    type: 'text',
    divBased: false,
    lineBreakRe: /\n/g,
    inheritableStatics: {
        shortHand1Re: /'(.*)'/g,
        shortHand2Re: / /g,
        shortHand3Re: /\s*,\s*/g,
        shortHand4Re: /\$\$\$\$/g,
        def: {
            processors: {
                x: "number",
                y: "number",
                text: "string",
                fontSize: function (n) {
                    if (!isNaN(n)) {
                        return +n + 'px';
                    } else if (n.match(Ext.dom.Element.unitRe)) {
                        return n;
                    }
                },
                fontStyle: (function (fontStyles) {
                    return function (n) {
                        if (!n) {
                            return "";
                        } else if (n === 'normal') {
                            return '';
                        } else if (!Ext.isString(n)) {
                            return undefined;
                        } else if (n in fontStyles) {
                            return n;
                        }
                    };
                })({"normal": true, "italic": true, "oblique": true}),
                fontVariant: (function (fontVariants) {
                    return function (n) {
                        if (!n) {
                            return "";
                        } else if (n === 'normal') {
                            return '';
                        } else if (n in fontVariants) {
                            return n;
                        }
                    };
                })({"normal": true, "small-caps": true}),
                fontWeight: (function (fontWeights) {
                    return function (n) {
                        if (!n) {
                            return "";
                        } else if (n === 'normal') {
                            return '';
                        } else if (!isNaN(n)) {
                            n = +n;
                            if (100 <= n && n <= 900) {
                                return n;
                            }
                        } else if (n in fontWeights) {
                            return n;
                        }
                    };
                })({"normal": true, "bold": true, "bolder": true, "lighter": true}),
                fontFamily: "string",
                textAlign: (function (textAligns) {
                    return function (n) {
                        if (n === 'middle') {
                            return 'center';
                        } else if (!n) {
                            return "center";
                        } else if (!Ext.isString(n)) {
                            return undefined;
                        } else if (n in textAligns) {
                            return n;
                        }
                    };
                })({"left": true, "right": true, "center": true, "start": true, "end": true}),
                textBaseline: (function (textBaselines) {
                    return function (n) {
                        if (n === false) {
                            return "alphabetic";
                        } else if (n in textBaselines) {
                            return n;
                        } else if (n === 'center') {
                            return 'middle';
                        }
                    };
                })({"top": true, "hanging": true, "middle": true, "alphabetic": true, "ideographic": true, "bottom": true}),
                font: "string"
            },
            aliases: {
                "font-size": "fontSize",
                "font-family": "fontFamily",
                "font-weight": "fontWeight",
                "font-variant": "fontVariant",
                "text-anchor": "textAlign"
            },
            defaults: {
                fontStyle: '',
                fontVariant: '',
                fontWeight: '',
                fontSize: '10px',
                fontFamily: 'sans-serif',
                font: '10px sans-serif',
                textBaseline: "alphabetic",
                textAlign: "start",
                strokeStyle: 'none',
                divBased: true,
                fillStyle: '#000',
                x: 0,
                y: 0,
                text: ''
            },
            dirtyTriggers: {
                fontStyle: 'font,bbox',
                fontVariant: 'font,bbox',
                fontWeight: 'font,bbox',
                fontSize: 'font,bbox',
                fontFamily: 'font,bbox',
                font: 'font-short-hand,bbox,canvas',
                textBaseline: 'bbox,canvas',
                textAlign: 'bbox,canvas',
                x: "bbox",
                y: "bbox",
                text: "bbox"
            },
            updaters: {
                "font-short-hand": (function (dispatcher) {
                    return function (attrs) {
                        // TODO: Do this according to http://www.w3.org/TR/CSS21/fonts.html#font-shorthand
                        var value = attrs.font,
                            parts, part, i, ln, dispKey;
                        value = value.replace(Ext.draw.sprite.Text.shortHand1Re, function (a, arg1) {
                            return arg1.replace(Ext.draw.sprite.Text.shortHand2Re, '$$$$');
                        });
                        value = value.replace(Ext.draw.sprite.Text.shortHand3Re, ',');
                        parts = value.split(' ');

                        attrs = {};
                        for (i = 0, ln = parts.length; i < ln; i++) {
                            part = parts[i];
                            dispKey = dispatcher[part];
                            if (dispKey) {
                                attrs[dispKey] = part;
                            } else if (part.match(Ext.dom.Element.unitRe)) {
                                attrs.fontSize = part;
                            } else {
                                attrs.fontFamily = part.replace(Ext.draw.sprite.Text.shortHand4Re, ' ');
                            }
                        }
                        this.setAttributesCanonical(attrs);
                    };
                })({
                    "italic": "fontStyles",
                    "oblique": "fontStyles",
                    "bold": "fontWeights",
                    "bolder": "fontWeights",
                    "lighter": "fontWeights",
                    "100": "fontWeights",
                    "200": "fontWeights",
                    "300": "fontWeights",
                    "400": "fontWeights",
                    "500": "fontWeights",
                    "600": "fontWeights",
                    "700": "fontWeights",
                    "800": "fontWeights",
                    "900": "fontWeights",
                    "small-caps": "fontVariant"
                }),
                "font": function (attrs) {
                    var font = '';
                    if (attrs.fontWeight) {
                        font += attrs.fontWeight + ' ';
                    }
                    if (attrs.fontVariant) {
                        font += attrs.fontVariant + ' ';
                    }
                    if (attrs.fontSize) {
                        font += attrs.fontSize + ' ';
                    }
                    if (attrs.fontFamily) {
                        font += attrs.fontFamily + ' ';
                    }
                    this.setAttributesCanonical({
                        font: font.substr(0, font.length - 1)
                    });
                }
            }
        }
    },

    constructor: function (config) {
        Ext.draw.sprite.Sprite.prototype.constructor.call(this, config);
    },

    updatePlainBBox: function (plain) {
        var me = this,
            attr = me.attr,
            x = attr.x,
            y = attr.y,
            font = attr.font,
            text = attr.text,
            baseline = attr.textBaseline,
            alignment = attr.textAlign,
            size = Ext.draw.TextMeasurer.measureText(text, font),
            height = size.height,
            width = size.width;

        switch (baseline) {
            case 'hanging' :
            case 'top':
                break;
            case 'ideographic' :
            case 'bottom' :
                y -= height;
                break;
            case 'alphabetic' :
                y -= height * 0.8;
                break;
            case 'middle' :
            case 'center' :
                y -= height * 0.5;
                break;
        }
        switch (alignment) {
            case 'end' :
            case 'right' :
                x -= width;
                break;
            case 'middle' :
            case 'center' :
                x -= width * 0.5;
                break;
        }

        plain.x = x;
        plain.y = y;
        plain.width = width;
        plain.height = height;
    },

    setText: function (text) {
        this.setAttributesCanonical({text: text});
    },

    useAttributes: function (ctx) {
        var me = this,
            attr = me.attr,
            font = attr.font;

        if (font !== ctx.font) {
            ctx.font = font;
        }
        ctx.textAlign = attr.textAlign;
        ctx.textBaseline = attr.textBaseline;
        Ext.draw.sprite.Sprite.prototype.useAttributes.call(this, ctx);
    },

    setElementStyles: function (element, styles) {
        var stylesCache = element.stylesCache || (element.stylesCache = {}),
            style = element.dom.style,
            name;
        for (name in styles) {
            if (stylesCache[name] !== styles[name]) {
                stylesCache[name] = style[name] = styles[name];
            }
        }
    },

    render: function (surface, ctx) {
        var attr = this.attr,
            mat = Ext.draw.Matrix.fly(attr.matrix.elements.slice(0)),
            bbox = this.getBBox(true),
            lineBreakRe = this.lineBreakRe,
            parent, div, x, y, i, lines, style;
        if (attr.text.length === 0) {
            return;
        }
        if ((surface instanceof Ext.draw.engine.Svg) || this.divBased) {
            parent = surface.element;
            div = surface.textDivs[surface.textPosition];
            if (!div) {
                div = Ext.Element.create({
                    style: {
                        "position": "absolute",
                        "left": 0,
                        "top": 0,
                        "width": bbox.width,
                        "text-align": attr.textAlign,
                        "overflow": 'visible',
                        "white-space": 'nowrap',
                        "font": attr.font
                    }
                });
                parent.append(div);
                surface.textDivs[surface.textPosition] = div;
            }

            mat.postpend(1, 0, 0, 1, bbox.x, bbox.y);
            mat.prependMatrix(surface.matrix);
            div.setHtml(attr.text.replace(lineBreakRe, '<br/>'));
            div.dom.style.display = attr.hidden ? "none" : "block";
            this.setElementStyles(div, {
                font: attr.font,
                left: '0px',
                top: '0px',
                color: attr.fillStyle,
                webkitTransformOrigin: "0% 0%",
                webkitTransform: mat.toSvg()
            });
            surface.textPosition++;
        } else {
            lines = attr.text.split('\n');
            x = attr.x;
            y = attr.y;
            mat.toContext(ctx);
            if (ctx.strokeStyle !== 'rgba(0, 0, 0, 0)') {
                for (i = 0; i < lines.length; i++) {
                    ctx.strokeText(lines[i], x, y + bbox.height / lines.length * i);
                }
            }
            if (ctx.fillStyle !== 'rgba(0, 0, 0, 0)') {
                for (i = 0; i < lines.length; i++) {
                    ctx.fillText(lines[i], x, y + bbox.height / lines.length * i);
                }
            }
        }
    }
}, function () {
    if (Ext.os.is.Android && !Ext.browser.is.Chrome) {
        this.prototype.divBased = true;
    }
});