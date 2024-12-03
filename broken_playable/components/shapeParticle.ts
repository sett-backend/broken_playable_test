import { BLEND_MODES, Container, Graphics } from 'pixi.js';
import { Power1 } from 'gsap';
import { lerp, degreesToRadians } from 'components/helper/math';
import { MonoBehavior } from 'components/classes/monoBehavior';

type Particle = {
    duration: number;
    start: { x: number; y: number };
    end: { x: number; y: number };
    scale: number;
    shape: Graphics;
    alpha: number;
    rotationStart: number;
    rotationEnd: number;
};
type ParticleProps = {
    parent: Container;
    position?: { x: number; y: number };
    amount?: number;
    size?: number;
    colors: number[];
};
export class Particles extends MonoBehavior {
    colors: number[];
    particles = [] as Particle[];
    startAnimation: number;
    position: { x: number; y: number };

    constructor(particleSettings: ParticleProps) {
        super();
        const { parent, colors, position = { x: 0, y: 0 }, amount = 50, size = 60 } = particleSettings;
        this.colors = colors || [0x000000, 0x565656, 0x959595, 0xffffff];
        this.position = position;

        for (let particle = 0; particle < amount; particle++) {
            const duration = lerp(0.7, 1.5, Math.random()) * 1000;
            const shape = new Graphics();
            shape.zIndex = 999;
            this.drawShape(shape, size, Math.random() > 0.8);
            shape.position.set(-99999, 0);
            shape.blendMode = BLEND_MODES.ADD;
            parent.addChild(shape);

            this.particles.push({
                duration,
                start: {
                    x: (Math.random() - 0.5) * size * 0.2,
                    y: (Math.random() - 0.5) * size * 0.2,
                },

                end: {
                    x: (Math.random() - 0.5) * size * 6,
                    y: (Math.random() - 0.5) * size * 6,
                },
                scale: lerp(0.6, 0.4, Math.random()),
                shape,
                alpha: lerp(0.6, 1, Math.random()),
                rotationStart: degreesToRadians(lerp(-180, 180, Math.random())),
                rotationEnd: degreesToRadians(lerp(-180, 180, Math.random())),
            });
        }
        this.startAnimation = performance.now();
    }
    update(): void {
        this.particles.forEach((particle) => {
            if (particle.shape.parent) {
                const prc = (performance.now() - this.startAnimation) / particle.duration;
                if (prc <= 1) {
                    particle.shape.alpha = lerp(particle.alpha, 0, prc);
                    particle.shape.position.x =
                        this.position.x + lerp(particle.start.x, particle.end.x, Power1.easeOut(prc));
                    particle.shape.position.y =
                        this.position.y + lerp(particle.start.y, particle.end.y, Power1.easeOut(prc));
                    particle.shape.scale.x = lerp(particle.scale, 0, Power1.easeOut(prc));
                    particle.shape.scale.y = lerp(particle.scale, 0, Power1.easeOut(prc));
                    particle.shape.rotation = lerp(particle.rotationStart, particle.rotationEnd, Power1.easeOut(prc));
                } else {
                    particle.shape.removeFromParent();
                    particle.shape.destroy();
                }
            }
        });
    }
    drawShape(g: Graphics, size: number, isCircle = false) {
        const color = this.colors[Math.floor(Math.random() * this.colors.length)];
        g.beginFill(color, 1);
        if (isCircle) {
            g.drawCircle(0, 0, size);
        } else {
            const random = Math.random();

            if (random < 0.5) {
                g.drawRoundedRect(-size / 2, -size / 2, size, size, size / 10);
            } else {
                g.drawRoundedRect(-size * 0.75, -size / 2, size * 1.5, size, size / 10);
            }
        }
        g.endFill();
    }
}
