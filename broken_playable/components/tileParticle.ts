import { Container, Texture, TilingSprite } from 'pixi.js';
import { Power1 } from 'gsap';
import { lerp, degreesToRadians } from 'components/helper/math';
import { MonoBehavior } from 'components/classes/monoBehavior';
import coinsImg from 'assets/game/coins.png';

type Particle = {
    duration: number;
    start: { x: number; y: number };
    end: { x: number; y: number };
    scale: number;
    shape: TilingSprite;
    alpha: number;
    rotationStart: number;
    rotationEnd: number;
};
type ParticleProps = {
    parent: Container;
    position?: { x: number; y: number };
    amount?: number;
    force?: number;
};
export class CoinsParticle extends MonoBehavior {
    particles = [] as Particle[];
    startAnimation: number;
    position: { x: number; y: number };
    startFrame = 0;
    constructor(particleSettings: ParticleProps) {
        super();
        const { parent, position = { x: 0, y: 0 }, amount = 50, force = 60 } = particleSettings;
        this.startFrame = Math.floor(Math.random() * 14);
        this.position = position;

        for (let particle = 0; particle < amount; particle++) {
            const duration = lerp(1, 2, Math.random()) * 1000;

            const shape = new TilingSprite(Texture.from(coinsImg), 60, 60);
            shape.anchor.set(0.5);
            parent.addChild(shape);
            shape.position.set(-9999, 0);
            this.particles.push({
                duration,
                start: {
                    x: (Math.random() - 0.5) * force * 0.2,
                    y: (Math.random() - 0.2) * force * 0.4,
                },

                end: {
                    x: (Math.random() - 0.5) * force * 6,
                    y: (Math.random() - 0.5) * force * 6,
                },
                scale: lerp(1, 2, Math.random()),
                shape,
                alpha: lerp(0.9, 1, Math.random()),
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
                    particle.shape.alpha = lerp(particle.alpha, 0.5, prc);
                    particle.shape.position.x =
                        this.position.x + lerp(particle.start.x, particle.end.x, Power1.easeOut(prc));
                    particle.shape.position.y =
                        this.position.y + lerp(particle.start.y, particle.end.y, Power1.easeOut(prc));
                    particle.shape.scale.x = lerp(particle.scale, 0, Power1.easeOut(prc));
                    particle.shape.scale.y = lerp(particle.scale, 0, Power1.easeOut(prc));
                    particle.shape.rotation = lerp(particle.rotationStart, particle.rotationEnd, Power1.easeOut(prc));

                    const tileFrame = this.startFrame + Math.floor(lerp(0, 32, prc));
                    particle.shape.tilePosition.x = (-tileFrame % 7) * 60;
                    particle.shape.tilePosition.y = -Math.floor(tileFrame / 7) * 60;
                } else {
                    particle.shape.removeFromParent();
                    particle.shape.destroy();
                }
            }
        });
    }
}
