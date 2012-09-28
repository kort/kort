//@define Ext.draw.fx.TimingFunctions

(function () {
    var pow = Math.pow,
        sin = Math.sin,
        cos = Math.cos,
        PI = Math.PI,
        EasingPrototype, addEasing, Poly, createPoly, easing, i, l;

    //create polynomial easing equations
    Poly = ['Quad', 'Cubic', 'Quart', 'Quint'];

    //create other easing equations
    EasingPrototype = {

        Pow: function (p, x) {
            return pow(p, x[0] || 6);
        },

        Expo: function (p) {
            return pow(2, 8 * (p - 1));
        },

        Circ: function (p) {
            return 1 - Math.sqrt(1 - p * p);
        },

        Sine: function (p) {
            return 1 - sin((1 - p) * PI / 2);
        },

        Back: function (p, n) {
            n = n || 1.616;
            return p * p * ((n + 1) * p - n);
        },

        Bounce: function (p) {
            var value;
            for (var a = 0, b = 1; 1; a += b, b /= 2) {
                if (p >= (7 - 4 * a) / 11) {
                    value = b * b - pow((11 - 6 * a - 11 * p) / 4, 2);
                    break;
                }
            }
            return value;
        },

        Elastic: function (p, x) {
            return pow(2, 10 * --p) * cos(20 * p * PI * (x || 1) / 3);
        }
    };

    //Add easeIn, easeOut, easeInOut options to all easing equations.
    addEasing = function (easing, params) {
        params = params && params.length ? params : [ params ];
        return Ext.apply(easing, {

            easeIn: function (pos) {
                return easing(pos, params);
            },

            easeOut: function (pos) {
                return 1 - easing(1 - pos, params);
            },

            easeInOut: function (pos) {
                return (pos <= 0.5) ? easing(2 * pos, params) / 2
                    : (2 - easing(2 * (1 - pos), params)) / 2;
            }
        });
    };

    //Append the polynomial equations with easing support to the EasingPrototype.
    createPoly = function (times) {
        return function (p) {
            return pow(p, times);
        };
    };

    for (i = 0, l = Poly.length; i < l; ++i) {
        EasingPrototype[Poly[i]] = createPoly(i + 2);
    }

    //Add linear interpolator
    EasingPrototype.Linear = function (x) {
        return x;
    };

    for (easing in EasingPrototype) {
        if (EasingPrototype.hasOwnProperty(easing)) {
            addEasing(EasingPrototype[easing]);
        }
    }

    /**
     * Contains transition equations such as `Quad`, `Cubic`, `Quart`, `Quint`,
     * `Expo`, `Circ`, `Pow`, `Sine`, `Back`, `Bounce`, `Elastic`, etc.
     *
     * Contains transition equations such as `Quad`, `Cubic`, `Quart`, `Quint`, `Expo`, `Circ`, `Pow`, `Sine`, `Back`, `Bounce`, `Elastic`, etc.
     * Each transition also contains methods for applying this function as ease in, ease out or ease in and out accelerations.
     *
     *     var fx = Ext.create('Ext.draw.fx.Sprite', {
     *         sprite: sprite,
     *         duration: 1000,
     *         easing: 'backOut'
     *     });
     */
    Ext.define('Ext.draw.fx.TimingFunctions', Ext.apply({
        singleton: true,
        EasingMap: {
            linear: EasingPrototype.Linear,
            easeIn: EasingPrototype.Quad.easeIn,
            easeOut: EasingPrototype.Quad.easeOut,
            easeInOut: EasingPrototype.Quad.easeInOut,
            backIn: EasingPrototype.Back,
            backOut: function (x, n) {
                return 1 - EasingPrototype.Back(1 - x, n);
            },
            backInOut: function (x, n) {
                if (x < 0.5) {
                    return EasingPrototype.Back(x * 2, n) * 0.5;
                } else {
                    return 1 - EasingPrototype.Back((1 - x) * 2, n) * 0.5;
                }
            },
            elasticIn: function (x, n) {
                return 1 - EasingPrototype.Elastic(1 - x, n);
            },
            elasticOut: EasingPrototype.Elastic,
            bounceIn: EasingPrototype.Bounce,
            bounceOut: function (x) {
                return 1 - EasingPrototype.Bounce(1 - x);
            }
        }
    }, EasingPrototype));

})();

