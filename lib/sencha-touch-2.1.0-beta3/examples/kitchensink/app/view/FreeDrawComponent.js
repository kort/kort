(function () {

    var seed = .5, count = 0;

    function random() {
        seed *= 15.1;
        seed -= Math.floor(seed);
        return seed;
    }

    function smoothenPart(y0, y1, y2, y3) {
        if (y0 === undefined) {
            if (y3 === undefined) {
                return [y1, (y1 * 2 + y2) / 3, (y1 + y2 * 2) / 3, y2];
            } else {
                return [y1, 13 * y1 / 18 + y2 / 3 - y3 / 18, 5 * y1 / 18 + 5 * y2 / 6 - y3 / 9, y2];
            }
        } else if (y3 === undefined) {
            return [y1, -y0 / 9 + 5 * y1 / 6 + 5 * y2 / 18, -y0 / 18 + y1 / 3 + 13 * y2 / 18, y2];
        } else {
            return [y1, -y0 / 9 + 5 * y1 / 6 + y2 / 3 - y3 / 18, -y0 / 18 + y1 / 3 + 5 * y2 / 6 - y3 / 9, y2];
        }
    }

    function smoothenList(points) {
        if (points.length < 3) {
            return points;
        }
        var result = [], x, y;
        result.push(['M', points[0], points[1]]);
        for (var i = 0; i < points.length - 2;) {
            x = smoothenPart(points[i - 2], points[i], points[i + 2], points[i + 4]);
            i++;
            y = smoothenPart(points[i - 2], points[i], points[i + 2], points[i + 4]);
            i++;
            result.push(['C', x[1], y[1], x[2], y[2], x[3], y[3]]);
        }
        result.isBSegs = true;
        return result;
    }

    var sprite, list = [], old1 = [0, 0], old2 = [0, 0];
    /**
     * Demonstrates smoothening and cubic bezier Curve rendering
     */
    Ext.define('Kitchensink.view.FreeDrawComponent', {
        extend: 'Ext.draw.Component',
        config: {
            background: 'white',
            listeners: {
                element: 'element',
                'drag': function (e) {
                    if (sprite) {
                        var cmp = this,
                            p = e.touches[0].point,
                            xy = cmp.element.getXY(),
                            step = false;
                        if (this.lastEvent + 10 > e.timeStamp) {
                            list.length -= 2;
                        } else {
                            list.length -= 2;
                            list.push(p.x - xy[0], p.y - xy[1]);
                            step = true;
                            this.lastEvent = e.timeStamp;
                        }
                        list.push(p.x - xy[0], p.y - xy[1]);
                        count++;
                        var path = smoothenList(list);
                        if (step) {
                            sprite.setAttributes({
                                path: path
                            });
                            if (Ext.os.is.Android) {
                                setTimeout(function () {
                                    cmp.getSurface('overlay').renderFrame();
                                }, 10);
                            } else {
                                cmp.getSurface('overlay').renderFrame();
                            }

                        }
                    }
                },
                'touchstart': function (e) {
                    if (!sprite) {
                        var cmp = this,
                            p0 = cmp.element.getXY(),
                            p = [e.pageX - p0[0], e.pageY - p0[1]];
                        list = [p[0], p[1]];
                        count++;
                        cmp.getSurface('overlay').element.setStyle({zIndex: 1});
                        sprite = cmp.getSurface('overlay').add({
                            type: 'path',
                            path: ['M', list[0], list[1], 'L', list[0] + 1e-5, list[1] + 1e-5],
                            lineWidth: 30 * random() + 10,
                            lineCap: 'round',
                            lineJoin: 'round',
                            strokeStyle: new Ext.draw.Color(random() * 127 + 128, random() * 127 + 128, random() * 127 + 128)
                        });
                        old1 = old2 = p;
                        cmp.getSurface('overlay').renderFrame();
                    }
                },
                'dragend': function (e) {
                    var cmp = this,
                        p0 = cmp.element.getXY(),
                        p = [e.pageX - p0[0], e.pageY - p0[1]];
                    list.push(p[0], p[1]);
                    count++;
                    var path = smoothenList(list);
                    sprite.setAttributes({
                        path: path
                    });
                    var newSprite = cmp.getSurface().add({
                        type: 'path',
                        path: smoothenList(list),
                        lineWidth: sprite.attr.lineWidth,
                        lineCap: 'round',
                        lineJoin: 'round',
                        strokeStyle: sprite.attr.strokeStyle
                    });
                    cmp.getSurface().setDirty(true);
                    cmp.getSurface().renderFrame();
                    sprite.destroy();
                    cmp.getSurface('overlay').renderFrame();
                    sprite = null;
                }
            }
        },
        onResize: function () {
            var size = this.element.getSize();
            this.getSurface().setRegion([0, 0, size.width, size.height]);
            this.getSurface('overlay').setRegion([0, 0, size.width, size.height]);
        }
    });
})();


