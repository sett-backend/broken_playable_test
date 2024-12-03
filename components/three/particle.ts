import { MonoBehavior } from 'components/classes/monoBehavior';
import gsap, { Power1 } from 'gsap';
import { Mesh, Group, Vector3, SphereGeometry } from 'three';
import { lerp } from 'components/helper/math';
import { createStandardMaterial } from './materials/standard';
import { Game } from 'components/classes/game';

export type ParticleOption = {
    color: number[];
    lifeTime?: [number, number];
    sizeStart?: [number, number];
    opacityStart?: [number, number];
    opacityEnd?: [number, number];
    sizeEnd?: [number, number];
    force?: [number, number];
    rotationStart?: [number, number];
    rotationEnd?: [number, number];
    count?: [number, number];
};
const defaultOptions = {
    count: [10, 20],
    lifeTime: [300, 1000],
    sizeStart: [0, 0],
    sizeEnd: [1, 1],
    force: [-1, 1],
    opacityStart: [1, 1],
    opacityEnd: [0, 0],
    rotationStart: [-360, 360],
    rotationEnd: [-360, 360],
};
export class Particles extends MonoBehavior {
    particles = [] as Particle[];

    constructor(position: Vector3, options: ParticleOption) {
        super();
        const countArray = options.count || defaultOptions.count;
        const count = lerp(countArray[0], countArray[1], Math.random());

        for (let i = 0; i < count; i++) {
            this.particles.push(new Particle(position, this.getRandomOptions(options)));
        }
    }
    getRandomOptions(options: ParticleOption) {
        const {
            lifeTime = defaultOptions.lifeTime,
            sizeStart = defaultOptions.sizeStart,
            sizeEnd = defaultOptions.sizeEnd,
            force = defaultOptions.force,
            rotationStart = defaultOptions.rotationStart,
            rotationEnd = defaultOptions.rotationEnd,
            opacityStart = defaultOptions.opacityStart,
            opacityEnd = defaultOptions.opacityEnd,
            color,
        } = options;
        const particleOptions = {
            lifeTime: lerp(lifeTime[0], lifeTime[1], Math.random()),
            sizeStart: lerp(sizeStart[0], sizeStart[1], Math.random()),
            sizeEnd: lerp(sizeEnd[0], sizeEnd[1], Math.random()),
            force: new Vector3(
                lerp(force[0], force[1], Math.random()) * Math.sign(Math.random() - 0.5),
                lerp(force[0], force[1], Math.random()) * Math.sign(Math.random() - 0.5),
                lerp(force[0], force[1], Math.random()) * Math.sign(Math.random() - 0.5)
            ),
            rotationStart: lerp(rotationStart[0], rotationStart[1], Math.random()),
            rotationEnd: lerp(rotationEnd[0], rotationEnd[1], Math.random()),
            opacityStart: lerp(opacityStart[0], opacityStart[1], Math.random()),
            opacityEnd: lerp(opacityEnd[0], opacityEnd[1], Math.random()),
            color: color[Math.floor(color.length * Math.random())],
        };

        return particleOptions;
    }
}

type ParticleProps = {
    lifeTime: number;
    sizeStart: number;
    sizeEnd: number;
    force: Vector3;
    rotationStart: number;
    rotationEnd: number;
    opacityStart: number;
    opacityEnd: number;
    color: number;
};
class Particle extends MonoBehavior {
    plane: Mesh;
    group: Group;
    lifeStart: number;
    option: ParticleProps;

    constructor(position: Vector3, props: ParticleProps) {
        super();
        const { opacityStart, sizeStart, rotationStart, sizeEnd, lifeTime, force, color, opacityEnd } = props;
        this.option = props;
        this.lifeStart = performance.now();
        this.group = new Group();
        const geometry = new SphereGeometry(1, 12, 12);

        this.group.position.set(position.x, position.y, position.z);

        const material = createStandardMaterial({ color, opacity: opacityStart, transparent: true });

        this.plane = new Mesh(geometry, material);
        this.plane.rotation.set(0, rotationStart, 0);
        this.group.add(this.plane);
        Game.addToScene(this.group);

        gsap.fromTo(
            this.plane.scale,
            {
                x: sizeStart,
                y: sizeStart,
                z: sizeStart,
            },
            {
                x: sizeEnd,
                y: sizeEnd,
                z: sizeEnd,
                ease: Power1.easeOut,
                duration: lifeTime / 1000,
            }
        );

        gsap.to(this.group.position, {
            x: position.x + force.x,
            y: position.y + force.y,
            z: position.z + force.z,
            ease: Power1.easeOut,
            duration: lifeTime / 1000,
        });
        gsap.to(this.plane.material, {
            opacity: opacityEnd,
            duration: lifeTime / 1000,
            ease: Power1.easeOut,
        });
    }
    update(): void {
        this.group.lookAt(Game.renderer.renderer3D.camera.position);
        this.plane.lookAt(Game.renderer.renderer3D.camera.position);
    }
}
