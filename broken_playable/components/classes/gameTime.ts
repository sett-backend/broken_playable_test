import { toGSAPTime } from 'root/constants/units';
import { Game } from './game';

export class GameTime {
    time = 0;
    deltaTime = 0;
    maximumDeltaTime = 0.05;

    constructor() {
        this.gameTimeUpdate = this.gameTimeUpdate.bind(this);
        requestAnimationFrame(this.gameTimeUpdate);
    }
    start() {
        this.time = performance.now();
    }
    gameTimeUpdate() {
        this.deltaTime = Math.min(toGSAPTime(performance.now() - this.time), this.maximumDeltaTime);
        requestAnimationFrame(this.gameTimeUpdate);
        this.time = performance.now();

        if (Game.isPlaying) {
            const gameObjects = Game.getGameObjects();

            gameObjects.forEach((go) => {
                if (!go._isStarted) {
                    go.beforeStartGameObject();
                }
            });

            gameObjects.forEach((go) => {
                if (!go._isStarted) {
                    go.startGameObject();
                }
            });
            gameObjects.forEach((go) => {
                if (go._isActive) {
                    go.beforeUpdate();
                }
            });
            gameObjects.forEach((go) => {
                if (go._isActive) {
                    go.update();
                }
            });
            gameObjects.forEach((go) => {
                if (go._isActive) {
                    go.lateUpdate();
                }
            });
        }
    }
}
export const Time = new GameTime();
