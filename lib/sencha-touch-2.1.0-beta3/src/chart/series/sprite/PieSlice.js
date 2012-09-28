Ext.define("Ext.chart.series.sprite.PieSlice", {
    alias: 'sprite.pieslice',
    mixins: {
        markerHolder: "Ext.chart.MarkerHolder"
    },
    extend: "Ext.draw.sprite.Sector",

    inheritableStatics: {
        def: {
            processors: {
                label: 'string',
                labelOverflowPadding: 'number'
            },
            defaults: {
                label: '',
                labelOverflowPadding: 10
            }
        }
    },

    preRender: function (surface) {
        var parent = this.getParent(),
            matrix = new Ext.draw.Matrix();
        while (parent && parent.attr && parent.attr.matrix) {
            matrix.prependMatrix(parent.attr.matrix);
            parent = parent.getParent();
        }
        matrix.prependMatrix(parent.matrix);
        this.surfaceMatrix = matrix;
        this.callSuper(arguments);
    },

    render: function (ctx, surface, clipRegion) {
        this.callSuper(arguments);
        if (this.attr.label && this.getBoundMarker('labels')) {
            this.placeLabel();
        }
    },

    placeLabel: function () {
        var attr = this.attr,
            startAngle = Math.min(attr.startAngle, attr.endAngle),
            endAngle = Math.max(attr.startAngle, attr.endAngle),
            midAngle = (startAngle + endAngle) * 0.5,
            margin = attr.margin,
            centerX = attr.centerX,
            centerY = attr.centerY,
            startRho = Math.min(attr.startRho, attr.endRho) + margin,
            endRho = Math.max(attr.startRho, attr.endRho) + margin,
            midRho = (startRho + endRho) * 0.5,
            surfaceMatrix = this.surfaceMatrix,
            labelCfg = this.labelCfg || (this.labelCfg = {}),
            labelBox, x, y;

        x = centerX + Math.cos(midAngle) * midRho;
        y = centerY + Math.sin(midAngle) * midRho;
        labelCfg.x = surfaceMatrix.x(x, y);
        labelCfg.y = surfaceMatrix.y(x, y);

        x = centerX + Math.cos(midAngle) * endRho;
        y = centerY + Math.sin(midAngle) * endRho;
        labelCfg.calloutStartX = surfaceMatrix.x(x, y);
        labelCfg.calloutStartY = surfaceMatrix.y(x, y);

        x = centerX + Math.cos(midAngle) * (endRho + 40);
        y = centerY + Math.sin(midAngle) * (endRho + 40);
        labelCfg.calloutPlaceX = surfaceMatrix.x(x, y);
        labelCfg.calloutPlaceY = surfaceMatrix.y(x, y);

        labelCfg.rotationRads = midAngle + Math.atan2(surfaceMatrix.y(1, 0) - surfaceMatrix.y(0, 0), surfaceMatrix.x(1, 0) - surfaceMatrix.x(0, 0));
        labelCfg.text = attr.label;
        labelCfg.calloutColor = this.attr.fillStyle;
        labelCfg.globalAlpha = attr.globalAlpha;

        this.putMarker('labels', labelCfg, this.attr.attributeId);

        labelBox = this.getMarkerBBox('labels', this.attr.attributeId, true);
        if (labelBox) {
            this.putMarker('labels', {callout: 1 - this.sliceContainsLabel(attr, labelBox)}, this.attr.attributeId);
        }
    },

    sliceContainsLabel: function (attr, bbox) {
        var padding = attr.labelOverflowPadding,
            middle = (attr.endRho + attr.startRho) / 2,
            outer = middle + (bbox.width + padding) / 2,
            inner = middle - (bbox.width + padding) / 2,
            l1, l2, l3;
        if (bbox.width + padding * 2 > (attr.endRho - attr.startRho)) {
            return 0;
        }
        l1 = Math.sqrt(attr.endRho * attr.endRho - outer * outer);
        l2 = Math.sqrt(attr.endRho * attr.endRho - inner * inner);
        l3 = Math.tan(Math.abs(attr.endAngle - attr.startAngle) / 2) * inner;
        if (bbox.height + padding * 2 > Math.min(l1, l2, l3) * 2) {
            return 0;
        }
        return 1;
    }
});