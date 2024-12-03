import { Game } from './game';
import { leadingZeros } from 'helper/stringFormat';
let gameObject = 0;
export class MonoBehavior {
    _isActive = true;
    _isStarted = false;
    _startTime: number;
    _id: string;

    constructor() {
        gameObject++;
        this._id = `GameObject_${leadingZeros(gameObject)}`;
        this._startTime = performance.now();
        this.start = this.start.bind(this);
        this.beforeUpdate = this.beforeUpdate.bind(this);
        this.update = this.update.bind(this);
        this.lateUpdate = this.lateUpdate.bind(this);
        this.setActive = this.setActive.bind(this);
        this.startGameObject = this.startGameObject.bind(this);
        this.destroy = this.destroy.bind(this);
        setTimeout(
            (self) => {
                Game.addGameObject(self);
            },
            1,
            this
        );
    }

    beforeStart(): void {}
    start(): void {}
    beforeUpdate() {}
    update(): void {}
    lateUpdate(): void {}
    beforeDestroy(): void {}
    setActive(active: boolean) {
        this._isActive = active;
    }
    startGameObject() {
        this._isStarted = true;
        this.start();
    }
    beforeStartGameObject() {
        this.beforeStart();
    }
    destroy() {
        Game.removeGameObject(this._id);
        this.setActive(false);
    }
    getLifeTime() {
        return performance.now() - this._startTime;
    }
}
