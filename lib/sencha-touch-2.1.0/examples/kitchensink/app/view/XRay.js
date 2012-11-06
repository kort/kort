//<feature charts>
Ext.define('Kitchensink.view.XRay', {
    alias: 'sprite.xray',
    extend: 'Ext.draw.sprite.Path',
    render: function (surface, ctx) {
        var attr = this.attr,
            mat = attr.matrix,
            imat = attr.inverseMatrix,
            path = attr.path,
            size = imat.x(2, 0) - imat.x(0, 0);
        if (attr.path.coords.length === 0) {
            return;
        }
        mat.toContext(ctx);
        var i = 0, j = 0,
            types = path.types,
            coords = path.coords,
            ln = path.types.length;

        ctx.beginPath();
        for (; i < ln; i++) {
            switch (types[i]) {
                case "M":
                    ctx.moveTo(coords[j], coords[j + 1]);
                    j += 2;
                    break;
                case "L":
                    ctx.lineTo(coords[j], coords[j + 1]);
                    j += 2;
                    break;
                case "C":
                    ctx.bezierCurveTo(
                        coords[j], coords[j + 1],
                        coords[j + 2], coords[j + 3],
                        coords[j + 4], coords[j + 5]
                    );
                    j += 6;
                    break;
                case "Z":
                    ctx.closePath();
                    break;
                default:
            }
        }
        ctx.fillStroke(attr);

        mat.toContext(ctx);
        ctx.beginPath();
        for (i = 0, j = 0; i < ln; i++) {
            switch (types[i]) {
                case "M":
                    ctx.moveTo(coords[j] - size, coords[j + 1] - size);
                    ctx.rect(coords[j] - size, coords[j + 1] - size, size * 2, size * 2);
                    j += 2;
                    break;
                case "L":
                    ctx.moveTo(coords[j] - size, coords[j + 1] - size);
                    ctx.rect(coords[j] - size, coords[j + 1] - size, size * 2, size * 2);
                    j += 2;
                    break;
                case "C":
                    ctx.moveTo(coords[j] + size, coords[j + 1]);
                    ctx.arc(coords[j], coords[j + 1], size, 0, Math.PI * 2, true);
                    j += 2;
                    ctx.moveTo(coords[j] + size, coords[j + 1]);
                    ctx.arc(coords[j], coords[j + 1], size, 0, Math.PI * 2, true);
                    j += 2;
                    ctx.moveTo(coords[j] + size * 2, coords[j + 1]);
                    ctx.rect(coords[j] - size, coords[j + 1] - size, size * 2, size * 2);
                    j += 2;
                    break;
                default:
            }
        }
        imat.toContext(ctx);
        ctx.strokeStyle = "black";
        ctx.strokeOpacity = 1;
        ctx.lineWidth = 1;
        ctx.stroke();

        mat.toContext(ctx);
        ctx.beginPath();
        for (i = 0, j = 0; i < ln; i++) {
            switch (types[i]) {
                case "M":
                    ctx.moveTo(coords[j], coords[j + 1]);
                    j += 2;
                    break;
                case "L":
                    ctx.moveTo(coords[j], coords[j + 1]);
                    j += 2;
                    break;
                case "C":
                    ctx.lineTo(coords[j], coords[j + 1]);
                    j += 2;
                    ctx.moveTo(coords[j], coords[j + 1]);
                    j += 2;
                    ctx.lineTo(coords[j], coords[j + 1]);
                    j += 2;
                    break;
                default:
            }
        }
        imat.toContext(ctx);
        ctx.lineWidth = 1 / 2;
        ctx.stroke();
    }
});
//</feature>