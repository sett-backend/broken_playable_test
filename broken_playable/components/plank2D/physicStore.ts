import { Body, Circle, Vec2, World } from 'planck-js';
import { positionToPhysic, renderToPhysic } from './helper/converter';
import { Time } from 'ui/helper/ticker';
import { GRAVITY, FPS, GRAVITY_IOS, FPS_IOS } from 'playable/constants/physic';
import { Coordinate } from 'components/types';
import { isAndroid } from 'ui/helper/adProtocols';

export type PhysicMaterial = { density?: number; restitution?: number; friction?: number };
export enum PhysicObjectType {
    CIRCLE = 'circle',
    BOX = 'box',
    SVG = 'svg',
}
const BALL_KEY_PREFIX = 'ball_id_';
export const PHYSIC_UPDATE = 'physicUpdate';

const balls: { [key: string]: Body } = {};
const physicWorld = World({
    gravity: Vec2(0, isAndroid() ? GRAVITY : GRAVITY_IOS),
    continuousPhysics: true,
    allowSleep: false,
});
export let physicActive = false;

export function initPhysic() {
    updatePhysic();
    physicActive = true;
}

export function getPhysicBall(id: number, newBallData: { material?: PhysicMaterial; radius: number; position: Coordinate; fixedRotation: boolean }) {
    const key = `${BALL_KEY_PREFIX}${id}`;
    let ballBody = balls[key];
    if (!ballBody) {
        ballBody = physicWorld.createDynamicBody({
            position: positionToPhysic(newBallData.position),
        });
        ballBody.setAngularDamping(-1100);
        ballBody.setFixedRotation(newBallData.fixedRotation);
        ballBody.createFixture(Circle(Vec2(0, 0), renderToPhysic(newBallData.radius)), newBallData.material);
        balls[key] = ballBody;
    }
    return ballBody;
}
export function createStaticBall(position: Coordinate, radius: number) {
    const ballBody = physicWorld.createDynamicBody({
        position: positionToPhysic(position),
    });

    ballBody.setFixedRotation(true);
    ballBody.createFixture(Circle(Vec2(0, 0), renderToPhysic(radius)), {
        density: 1000,
        friction: 0.1,
        restitution: 0.1,
    });
    return ballBody;
}
export function destroyBody(body: Body) {
    physicWorld.destroyBody(body);
}
const updateFunction = [] as (() => void)[];
let lastTime = Time.now();
const physicFps = isAndroid() ? FPS : FPS_IOS;
function updatePhysic() {
    const currentTime = Time.now();
    const delta = currentTime - lastTime;
    lastTime = currentTime;
    physicWorld.step(physicFps, delta / 1000);
    updateFunction.forEach((fn) => fn());

    window.requestAnimationFrame(updatePhysic);
}
export function addToPhysicFunction(callback: () => void) {
    updateFunction.push(callback);
}
export function createDynamicBody(dataBody: { position: Vec2; rotation?: number }) {
    return physicWorld.createDynamicBody(dataBody.position, dataBody.rotation);
}

export function createBody(dataBody: { position: Vec2 }) {
    return physicWorld.createBody(dataBody);
}
