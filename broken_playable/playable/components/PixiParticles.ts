import { Game } from 'components/classes/game';
import { Time } from 'components/classes/gameTime';
import { MonoBehavior } from 'components/classes/monoBehavior';
import { moveTowards } from 'components/helper/math';
import { Container, DisplayObject, Sprite, SpriteSource } from 'pixi.js';

class Point {
    x = 0;
    y = 0;
    constructor(x: number, y?: number) {
        this.set(x, y);
    }
    set(x: number, y?: number) {
        this.x = x;
        this.y = y || x;
    }
    rotate(rads: number) {
        const cos = Math.cos(rads);
        const sin = Math.sin(rads);
        const rotated = {
            x: this.x * cos - this.y * sin,
            y: this.x * sin + this.y * cos,
        };
        this.x = rotated.x;
        this.y = rotated.y;
    }
}

const defaultScaleEase = (v: number) => {
    return { x: 1, y: 1 };
};
export function scaleEaseFadeOut(v: number) {
    const fadeOutStart = 0.8;
    let s = 1;
    if (v >= fadeOutStart) {
        s = 1 - (v - fadeOutStart) / (1 - fadeOutStart);
    }
    return { x: s, y: s };
}
export function scaleEaseFadeInOut(v: number) {
    const fadeInStart = 0.2;
    const fadeOutStart = 0.8;
    let s = 1;
    if (v <= fadeInStart) {
        return v / fadeInStart;
    } else if (v >= fadeOutStart) {
        s = 1 - (v - fadeOutStart) / (1 - fadeOutStart);
    }
    return { x: s, y: s };
}
export function scaleEaseFadeOutConst(v: number) {
    return { x: 1 - v, y: 1 - v };
}

class Particle {
    sprite: Sprite;
    speed = new Point(0, 0);
    acceleration = new Point(0, 0);
    linearDamping = new Point(0, 0);
    rotationSpeed = 0;
    radialSpeed = 0;
    radialAcceleration = 0;
    scale = new Point(1, 1);
    scaleSpeed = 0;
    scaleEasing = defaultScaleEase;
    timer = 0;
    lifetime = 1;
    accelerationRot = 0;
    container: Container;
    constructor(sprite: Sprite, container?: Container) {
        this.sprite = sprite;
        this.sprite.anchor.set(0.5);
        this.container = container || Game.renderer.gameContainer;
        this.container.addChild(this.sprite as DisplayObject);
    }
    destroy() {
        this.container.removeChild(this.sprite as DisplayObject);
        this.sprite.destroy();
    }
    setPosition(x: number, y: number) {
        this.sprite.position.set(x, y);
    }
}

export class PixiParticles extends MonoBehavior {
    static instance: PixiParticles;
    particles: Particle[] = [];
    constructor() {
        super();
        PixiParticles.instance = this;
    }
    update(): void {
        const speed = new Point(0, 0);
        for (let i = this.particles.length - 1; i >= 0; --i) {
            const particle = this.particles[i];
            const dt = Time.deltaTime;

            particle.timer += dt;
            if (particle.timer >= particle.lifetime) {
                particle.destroy();
                this.particles.splice(i, 1);
                continue;
            }

            particle.accelerationRot += particle.radialSpeed * dt;

            particle.speed.x = moveTowards(particle.speed.x, 0, particle.linearDamping.x * dt);
            particle.speed.y = moveTowards(particle.speed.y, 0, particle.linearDamping.y * dt);

            particle.speed.x += particle.acceleration.x * dt;
            particle.speed.y += particle.acceleration.y * dt;

            speed.set(particle.speed.x, particle.speed.y);
            if (particle.accelerationRot != 0) {
                speed.rotate(particle.accelerationRot);
            }
            particle.sprite.position.x += speed.x * dt;
            particle.sprite.position.y += speed.y * dt;

            particle.sprite.rotation += particle.rotationSpeed * dt;

            const v = particle.timer / particle.lifetime;
            particle.scale.x += particle.scaleSpeed * dt;
            particle.scale.y += particle.scaleSpeed * dt;
            const scaleEasing = particle.scaleEasing(v);
            particle.sprite.scale.set(particle.scale.x * scaleEasing.x, particle.scale.y * scaleEasing.y);
        }
    }
    addParticle(sprite: SpriteSource, x: number, y: number, container?: Container) {
        const newParticle = new Particle(Sprite.from(sprite), container);
        newParticle.sprite.position.set(x, y);
        this.particles.push(newParticle);
        return newParticle;
    }
    addParticleSprite(sprite: Sprite, x: number, y: number, container?: Container) {
        const newParticle = new Particle(sprite, container);
        newParticle.sprite.position.set(x, y);
        this.particles.push(newParticle);
        return newParticle;
    }
}
