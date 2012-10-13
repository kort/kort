Ext.define("Particles.controller.Main", {

    extend: 'Ext.app.Controller',

    config: {

        refs: {
            particles: 'particles'
        },

        control: {
            'button[action=flame]': {
                tap: function () {
                    this.getParticles().setConfig({
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
                                duration: 800,
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
                    });
                }
            },

            'button[action=stars]': {
                tap: function () {
                    this.getParticles().emitter.instances.length = 0;
                    this.getParticles().setConfig({
                        parameters: {
                            velocity: 30,
                            direction: -90,
                            duration: 300,
                            accelerate: 20,
                            start: {
                                color: 'rgb(0,250,20)',
                                rotation: -90,
                                scale: 15,
                                opacity: 1
                            },
                            end: {
                                color: 'rgb(250,250,20)',
                                rotation: -90,
                                scale: 0,
                                opacity: 0
                            },
                            variance: {
                                velocity: 10,
                                rotation: 360,
                                scale: 0,
                                direction: 180,
                                duration: 300,
                                opacity: 0
                            },
                            x: 0,
                            y: 0
                        },
                        fading: 100,
                        template: {
                            type: 'path',
                            path: ['M', 0.3819660112501052, 0, 0.8090169943749475, 0.5877852522924731, 0.11803398874989487, 0.3632712640026805, -0.30901699437494734, 0.9510565162951536, -0.30901699437494745, 0.22451398828979277, -1, 1.2246063538223773e-16, -0.3090169943749475, -0.2245139882897927, -0.30901699437494756, -0.9510565162951535, 0.11803398874989479, -0.3632712640026805, 0.8090169943749473, -0.5877852522924734, 'Z']
                        },
                        ax: 0,
                        ay: 5
                    });
                }
            }
        }
    }
});