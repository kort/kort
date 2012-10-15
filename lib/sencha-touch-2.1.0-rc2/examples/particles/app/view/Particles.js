(function () {
    function rand() {
        return Math.random() * 2 - 1;
    }

    function clamp255(a, b, delta) {
        a += (b - a) * delta;
        a >>= 0;
        if (a < 0) {
            a = 0;
        }
        if (a > 255) {
            a = 255;
        }
        return a;
    }

    function clampColor(a, b, delta) {
        return 'rgb(' +
            clamp255(a.r, b.r, delta) + ',' +
            clamp255(a.g, b.g, delta) + ',' +
            clamp255(a.b, b.b, delta) + ')';
    }

    Ext.define("Particles.view.Particles", {
        requires: ['Particles.sprite.Emitter'], // ,'Ext.device.Orientation'],
        engine: 'Ext.draw.engine.Canvas',
        xtype: 'particles',
        extend: 'Ext.draw.Component',
        config: {
            parameters: {
                velocity: 0,
                direction: -90,
                duration: 1000,
                accelerate: 20,
                start: {
                    color: 'rgb(255,50,20)',
                    rotation: -90,
                    scale: 80,
                    opacity: 1
                },
                end: {
                    color: 'rgb(255,50,20)',
                    rotation: -90,
                    scale: 10,
                    opacity: 0
                },
                variance: {
                    velocity: 10,
                    rotation: 360,
                    scale: 10,
                    direction: 9,
                    duration: 100,
                    opacity: 0
                },
                x: 0,
                y: 0
            },
            fading: 0,
            template: {
                type: 'image',
                width: 1,
                height: 1,
                x: -0.5,
                y: -0.5,
                src: 'resources/gold-star.png'
            },
            ax: 0,
            ay: -5
        },

        getCorner: function () {
            var surface = this.getSurface(),
                region = surface.getRegion(),
                corner = surface.inverseMatrix.transformList([
                    [region[0], region[1]],
                    [region[0] + region[2], region[1] + region[3]]
                ]);
            return [corner[0][0], corner[0][1], corner[1][0] - corner[0][0], corner[1][1] - corner[0][1]];
        },

        initialize: function () {
            this.callParent(arguments);
            var me = this;

            me.element.setStyle({background: 'black'});
            me.emitter = me.getSurface().add({
                type: 'emitter',
                lineWidth: 1,
                globalCompositeOperation: 'lighter',
                step: me.onStep,
                scope: me,
                corner: me.getCorner()
            });
            me.emitter.setTemplate(me.getTemplate());
            me.element.on('mousemove', 'emitOnMove', me);
            me.element.on('drag', 'emitOnMove', me);
            me.element.on('tap', 'emitOnTap', me);
            // Ext.device.Orientation.on('orientationchange', 'onOrientationChange', me);
            setInterval(function () {
                if (me.emitter.instances.length < 100) {
                    me.emit(Math.min(5, 100 - me.emitter.instances.length));
                }
            }, 30);

            // <debug>
            me.fps = Ext.Element.create({});
            me.element.appendChild(me.fps);
            me.fps.setStyle({
                top: 0,
                left: 0,
                padding: 5,
                color: 'white',
                position: 'absolute',
                zIndex: 1000
            });
            setInterval(function () {
                if (Ext.draw.Animator.framerate) {
                    me.fps.setHtml(Ext.draw.Animator.framerate.toFixed(2) + 'fps with ' + me.emitter.instances.length + ' sprites');
                }
                Ext.draw.Animator.clearCounter();
            }, 1000);
            // </debug>
        },

//        onOrientationChange: function (e) {
//            var beta = Ext.draw.Draw.rad(e.beta),
//                gamma = Ext.draw.Draw.rad(e.gamma),
//                g = 50;
//            this.getAx() = Math.sin(gamma) * Math.cos(beta) * g;
//            this.getAy() = Math.sin(beta) * g;
//        },

        emitOnTap: function (e) {
            this.emitOnMove(e);
            this.emit(40);
        },

        emitOnMove: function (e) {
            var me = this,
                params = me.getParameters(),
                xy = me.element.getXY(),
                imat = me.getSurface().inverseMatrix;
            xy = [e.pageX - xy[0], e.pageY - xy[1]];
            xy = imat.transformPoint(xy);
            params.x = xy[0];
            params.y = xy[1];
            this.emit(1);
        },

        applyTemplate: function (temp) {
            return Ext.create('sprite.' + temp.type, temp);
        },

        updateTemplate: function (temp) {
            if (this.emitter) {
                this.emitter.setTemplate(temp);
            }
        },

        emit: function (n) {
            n = n || 1;
            var params = this.getParameters(),
                direction, velocity, i;
            for (i = 0; i < n; i++) {
                direction = Ext.draw.Draw.rad(params.direction + params.variance.direction * rand());
                velocity = params.velocity + params.variance.velocity * rand();
                this.emitter.emit({
                    x: params.x,
                    y: params.y,
                    vx: velocity * Math.cos(direction),
                    vy: velocity * Math.sin(direction),
                    opacityStart: params.start.opacity + params.variance.opacity * rand(),
                    opacityEnd: params.end.opacity + params.variance.opacity * rand(),
                    colorStart: Ext.draw.Color.create(params.start.color),
                    colorEnd: Ext.draw.Color.create(params.end.color),
                    scaleStart: Math.max(0, params.start.scale + params.variance.scale * rand()),
                    scaleEnd: Math.max(0, params.end.scale + params.variance.scale * rand()),
                    rotationStart: params.start.rotation + params.variance.rotation * rand(),
                    rotationEnd: params.end.rotation + params.variance.rotation * rand(),
                    accelerate: params.accelerate,
                    duration: params.duration + params.variance.duration * rand()
                });
            }
        },

        onStep: function (data, elapse, region) {
            if (elapse < data.duration) {
                var delta = data.lastTime ? elapse - data.lastTime : 0,
                    lambda = elapse / data.duration;
                data.lastTime = elapse;
                delta /= 100;
                data.x += data.vx * delta;
                data.y += data.vy * delta;
                data.vx += this.getAx() * delta;
                data.vy += this.getAy() * delta;
                if (data.x < region[0] && data.vx < 0) {
                    data.vx = -data.vx;
                }
                if (data.x > region[0] + region[2] && data.vx > 0) {
                    data.vx = -data.vx;
                }
                if (data.y < region[1] && data.vy < 0) {
                    data.vy = -data.vy;
                }
                if (data.y > region[1] + region[3] && data.vy > 0) {
                    data.vy = -data.vy;
                }
                return {
                    strokeStyle: clampColor(data.colorStart, data.colorEnd, lambda),
                    globalAlpha: data.opacityStart + (data.opacityEnd - data.opacityStart) * lambda,
                    scalingX: data.scaleStart + (data.scaleEnd - data.scaleStart) * lambda,
                    scalingY: data.scaleStart + (data.scaleEnd - data.scaleStart) * lambda,
                    rotationRads: Ext.draw.Draw.rad(data.rotationStart + (data.rotationEnd - data.rotationStart) * lambda),
                    translationX: data.x,
                    translationY: data.y
                };
            } else {
                return false;
            }
        },

        onResize: function () {
            var size = this.element.getSize(),
                surface = this.getSurface();
            surface.setRegion([0, 0, size.width, size.height]);
            surface.matrix.elements[4] = size.width / 2;
            surface.matrix.elements[5] = size.height / 2;
            surface.inverseMatrix = surface.matrix.inverse();
            this.emitter.setAttributes({
                corner: this.getCorner()
            });
        }
    });
})();