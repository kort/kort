/**
 * The SvgExporter class provides a generate function which generates the export
 * and returns a SVG string containing all the chart's elements.
 *
 * TODO: Fix this
 * 
 * Used in {@link Ext.draw.Surface#save}
 */
Ext.define("Ext.draw.engine.SvgExporter", {
    requires: ['Ext.draw.Surface'],
    /**
     * Used to generate a SVG string containing all the chart's elements.
     *
     * @param {Object} config The config object for the export generation. Currently not used.
     * @param {Array} surfaces The chart's surfaces
     */
    generate: function (config, surfaces) {
        var me = this,
            width = me.width,
            height = me.height,
            gradients = me.gradients,
            svg = '<?xml version="1.0" standalone="yes"?>' +
                '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">' +
                '<svg width="' + width + 'px" height="' + height +
                'px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">',
            gradient,
            i, ln, j, ln2, item, items, surface, offsetLeft, offsetTop;

        for (i = 0, ln = surfaces.length; i < ln; i++) {
            surface = surfaces[i];
            items = surface.getItems();
            ln2 = items.length;
            if (ln2 === 0) {
                continue;
            }

            offsetTop = parseFloat(surface.element.getStyle('top'));
            offsetLeft = parseFloat(surface.element.getStyle('left'));

            offsetTop = isNaN(offsetTop) ? 0 : offsetTop;
            offsetLeft = isNaN(offsetLeft) ? 0 : offsetLeft;

            // nested svg 
            // each layer is represented by an svg element containing its sprites
            // required because the sprite positions are from inside a layer
            svg += '<svg x="' + offsetLeft + '" y="' + offsetTop +
                '" width="' + surface.width + '" height="' + surface.height + '">';

            // add gradients definition
            if (gradients.length > 0) {
                svg += '<defs>';
                gradient = gradients[i];
                for (j = 0, ln2 = gradient.length; j < ln2; j++) {
                    svg += me.renderGradient(gradient[j]);
                }
                svg += '</defs>';
            }

            for (j = 0, ln2 = items.length; j < ln2; j++) {
                item = items[j];
                if (!item.attr.hidden) {
                    svg += me[item.type](item);
                }
            }
            svg += '</svg>';
        }
        svg += '</svg>';
        return svg;
    },

    toPropertyString: function (obj) {
        var propString = [];
        for (var key in obj) {
            if (obj.hasOwnProperty(key) && obj[key] !== null) {
                propString.push(key, '="', obj[key], '"');
            }
        }
        return propString.join(' ');
    },

    path: function (sprite) {
        var me = this,
            attr = sprite.attr,
            path = attr.path,
            pathString, i, ln, p;
        if (Ext.isArray(path[0])) {
            pathString = [];
            for (i = 0, ln = path.length; i < ln; i++) {
                p = path[i];
                pathString.push(p.join(' '));
            }
            pathString = pathString.join('');
        } else if (Ext.isArray(path)) {
            pathString = path.join(' ');
        } else {
            pathString = path.replace(/,/g, ' ');
        }

        var props = me.toPropertyString({
            d: pathString,
            fill: attr.fill,
            stroke: attr.stroke,
            'fill-opacity': attr.opacity,
            'stroke-width': attr['stroke-width'],
            'stroke-opacity': attr['stroke-opacity'],
            transform: sprite.matrix.toSvg()
        });

        return '<path ' + props + '/>';
    },

    text: function (sprite) {
        var me = this,
            attr = sprite.attr, fontRegex = /^(-?\d*\.?\d*){1}(em|ex|px|in|cm|mm|pt|pc|%)\s('*.*'*)/,
            match = fontRegex.exec(attr.font),
            size = match[1],
            family = match[3],
            text = attr.text,
            tspanString = '',
            props = me.toPropertyString({
                x: attr.x,
                y: attr.y,
                'font-size': size,
                'font-family': family,
                'font-weight': attr['font-weight'],
                'text-anchor': attr['text-anchor'],
                // if no fill property is set it will be black
                fill: attr.fill || '#000',
                'fill-opacity': attr.opacity,
                transform: sprite.matrix.toSvg()
            });

        tspanString += '<tspan x="' + attr.x + '" dy="' + (size / 4) + '">';
        tspanString += Ext.String.htmlEncode(text) + '</tspan>';

        return '<text ' + props + '>' + tspanString + '</text>';
    },

    rect: function (sprite) {
        var me = this,
            attr = sprite.attr,
            props = me.toPropertyString({
                x: attr.x,
                y: attr.y,
                rx: attr.rx,
                ry: attr.ry,
                width: attr.width,
                height: attr.height,
                fill: attr.fill,
                'fill-opacity': attr.opacity,
                stroke: attr.stroke,
                'stroke-width': attr['stroke-width'],
                'stroke-opacity': attr['stroke-opacity'],
                transform: sprite.matrix.toSvg()
            });

        return '<rect ' + props + '/>';
    },

    circle: function (sprite) {
        var me = this,
            attr = sprite.attr,
            props = me.toPropertyString({
                cx: attr.x,
                cy: attr.y,
                r: attr.radius,
                fill: attr.fill,
                'fill-opacity': attr.opacity,
                stroke: attr.stroke,
                'stroke-width': attr['stroke-width'],
                'stroke-opacity': attr['stroke-opacity'],
                transform: sprite.matrix.toSvg()
            });

        return '<circle ' + props + ' />';
    },

    image: function (sprite) {
        var me = this,
            attr = sprite.attr,
            props = me.toPropertyString({
                x: attr.x - Math.floor(attr.width / 2),
                y: attr.y - Math.floor(attr.height / 2),
                width: attr.width,
                height: attr.height,
                'xlink:href': attr.src,
                transform: sprite.matrix.toSvg()
            });

        return '<image ' + props + ' />';
    },

    // TODO: take angle in account / radialGradients?
    renderGradient: function (gradient) {
        var stops = gradient.stops, stop, stopsString = '';

        for (var key in stops) {
            if (stops.hasOwnProperty(key)) {
                stop = stops[key];
                stopsString += '<stop offset="' + key + '%" stop-color="' + stops[key].color + '" />';
            }
        }

        return '<linearGradient id="' + gradient.id + '" x1="0%" x2="0%" y1="0%" y2="100%" >' +
            stopsString +
            '</linearGradient>';
    }
});
