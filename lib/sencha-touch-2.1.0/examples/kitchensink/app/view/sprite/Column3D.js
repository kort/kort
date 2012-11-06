/**
 *
 */
//<feature charts>
Ext.define("Kitchensink.view.sprite.Column3D", {
    alias: 'sprite.columnSeries3d',
    extend: 'Ext.chart.series.sprite.Bar',
    inheritableStatics: {
        def: {
            defaults: {
                transformFillStroke: true
            }
        }
    },
    lastClip: null,

    drawBar: function (ctx, surface, clip, left, top, right, bottom, itemId) {
        var me = this,
            attr = me.attr,
            center = (left + right) / 2,
            barWidth = (right - left) * 0.33333,
            depthWidth = barWidth * 0.5,
            color = Ext.draw.Color.create(attr.fillStyle),
            darkerColor = color.createDarker(0.05),
            lighterColor = color.createLighter(0.25);

        ctx.beginPath();
        ctx.moveTo(center - barWidth, top);
        ctx.lineTo(center - barWidth + depthWidth, top + depthWidth);
        ctx.lineTo(center + barWidth + depthWidth, top + depthWidth);
        ctx.lineTo(center + barWidth, top);
        ctx.lineTo(center - barWidth, top);
        ctx.fillStyle = lighterColor.toString();
        ctx.fillStroke(attr);

        ctx.beginPath();
        ctx.moveTo(center + barWidth, top);
        ctx.lineTo(center + barWidth + depthWidth, top + depthWidth);
        ctx.lineTo(center + barWidth + depthWidth, bottom + depthWidth);
        ctx.lineTo(center + barWidth, bottom);
        ctx.lineTo(center + barWidth, top);
        ctx.fillStyle = darkerColor.toString();
        ctx.fillStroke(attr);

        ctx.beginPath();
        ctx.moveTo(center - barWidth, bottom);
        ctx.lineTo(center - barWidth, top);
        ctx.lineTo(center + barWidth, top);
        ctx.lineTo(center + barWidth, bottom);
        ctx.lineTo(center - barWidth, bottom);
        ctx.fillStyle = darkerColor.toString();
        if (!(surface instanceof Ext.draw.engine.Svg)) {
            if (!this.lastClip || this.lastClip[0] !== Math.round(clip[1]) || this.lastClip[1] !== Math.round(clip[3])) {
                this.lastClip = [Math.round(clip[1]), Math.round(clip[3])];
                this.grad = ctx.createLinearGradient(0, clip[1], 0, clip[3]);
                this.grad.addColorStop(0, lighterColor.toString());
                this.grad.addColorStop(1, darkerColor.toString());
            }
            ctx.fillStyle = this.grad;
        } else {
            ctx.fillStyle = color.toString();
        }
        ctx.fillStroke(attr);
    }
});
//</feature>
