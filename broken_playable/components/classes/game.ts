import { isVisible } from 'helper/adProtocols';
import { MonoBehavior } from './monoBehavior';
import { PlayableRenderer } from 'components/classes/playableRenderer';
import { Time } from './gameTime';
import { GameLoader } from './gameLoader';
import { Container } from 'pixi.js';
import { getScreenSize } from 'helper/screen';
import { Canvas3D } from './canvas3D';

class GameClass {
    isPlaying: boolean;
    gameObjectsList: MonoBehavior[];
    isStarted = false;
    playableRenderer?: PlayableRenderer;
    canvas3D?: Canvas3D;

    gameLoader: GameLoader;

    constructor() {
        this.isPlaying = false;
        this.gameObjectsList = [] as MonoBehavior[];

        Time.start();
        this.gameLoader = new GameLoader();
    }
    pause() {
        this.isPlaying = false;
    }
    play() {
        this.isPlaying = true;
    }

    start() {
        this.playableRenderer = new PlayableRenderer();
        this.canvas3D = new Canvas3D();

        this.isStarted = true;
        if (isVisible()) {
            this.play();
        } else {
            this.pause();
        }
    }

    getGameObjects() {
        return this.gameObjectsList;
    }
    addGameObject(go: MonoBehavior) {
        const invalid = this.gameObjectsList.filter((g) => g._id === go._id);
        if (invalid) {
            go._id = go._id + Math.random();
        }
        this.gameObjectsList.push(go);
    }
    removeGameObject(id: string) {
        this.gameObjectsList = this.gameObjectsList.filter((go) => go._id !== id);
    }
    removeGameLoader() {
        this.gameLoader.remove();
    }
    addToUI(container: Container) {
        this.renderer.uiContainer.addChild(container);
    }
    removeFromUI(container: Container) {
        this.renderer.uiContainer.removeChild(container);
    }
    addToLevel(container: Container) {
        this.renderer.gameContainer.addChild(container);
    }
    removeFromLevel(container: Container) {
        this.renderer.gameContainer.removeChild(container);
    }
    addToBackground(container: Container) {
        this.renderer.bgContainer.addChild(container);
    }
    get renderer() {
        if (this.playableRenderer) return this.playableRenderer;
        else {
            this.playableRenderer = new PlayableRenderer();
            return this.playableRenderer;
        }
    }
    getSceneScale() {
        return Game.renderer.scale;
    }
    getSceneSize() {
        const screenSize = getScreenSize();
        const screenScale = this.getSceneScale();
        return {
            x: screenSize.width / screenScale,
            y: screenSize.height / screenScale,
        };
    }
}

export const Game = new GameClass();
