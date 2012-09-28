/**
 * The ImageExporter class provides a generate function which generates the export
 * and returns a base64 encoded image dataURL containing all the chart's elements.
 * 
 * TODO: Fix this
 * 
 * Used in {@link Ext.draw.Surface#save}
 */
Ext.define('Ext.draw.engine.ImageExporter', {
    requires: ['Ext.draw.engine.Canvas'],
    singleton: true,

    stripRe: /px/,
    /**
     * Used to generate a base64 encoded image dataURL containing all the chart's elements.
     *
     * @param {Object} config The config object for the export generation.
     * @param {Array} surfaces The chart's surfaces.
     * @return {Object}
     */
    generate: function (config, surfaces) {
        var canvas = document.createElement("canvas"),
            type = config.type || "image/png",
            len = surfaces.length,
            ctx = canvas.getContext("2d"),
            width = surfaces[0].canvas.width,
            height = surfaces[0].canvas.height,
            stripRe = this.stripRe,
            surface, top, left, i, element;

        canvas.width = width;
        canvas.height = height;

        if (type === "image/jpeg") {
            // draw a white background if user wants to save a jpeg
            // otherwise the alpha channel would result in a black background
            ctx.save();
            ctx.fillStyle = "rgb(255,255,255)";
            ctx.fillRect(0, 0, width, height);
            ctx.restore();
        }

        // drawing all the layers on the canvas
        // considering that they probably have different positions
        for (i = 0; i < len; i++) {
            surface = surfaces[i];
            element = surface.element;
            width = element.getWidth();
            height = element.getHeight();

            top = isNaN(element.getStyle('top').replace(stripRe, '')) ? 0 : top;
            left = isNaN(element.getStyle('left').replace(stripRe, '')) ? 0 : left;

            if (width && height) {
                ctx.drawImage(surface.canvas, left, top);
            }
        }

        return canvas.toDataURL(config.type);
    }
});
