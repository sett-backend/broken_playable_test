import { PixiRenderer } from 'components/pixiRenderer';
import { addResizeListener } from 'helper/adProtocols';
import { Container, Point } from 'pixi.js';
import { playableSettings } from '../../playable/playableSettings';
import { MonoBehavior } from './monoBehavior';

type CallbackItem = {
    cb: Function;
    id: string;
};

export class PlayableRenderer extends MonoBehavior {
    renderer: PixiRenderer;
    gameContainer: Container;
    uiContainer: Container;
    bgContainer: Container;
    bgEnvelopeSize?: Point;
    scale = 1;
    onRendererResized: Array<CallbackItem> = [];

    constructor() {
        super();
        this.resizePlayable = this.resizePlayable.bind(this);
        this.gameContainer = new Container();
        this.uiContainer = new Container();
        this.bgContainer = new Container();
        this.bgEnvelopeSize = undefined;

        this.gameContainer.sortableChildren = true;
        this.uiContainer.sortableChildren = true;
        this.bgContainer.sortableChildren = true;
        this.renderer = new PixiRenderer();
    }
    beforeStart(): void {
        this.renderer.app.stage.addChild(this.bgContainer);
        this.renderer.app.stage.addChild(this.gameContainer);
        this.renderer.app.stage.addChild(this.uiContainer);
    }
    start() {
        addResizeListener(this.resizePlayable, 'resizeLevel');
    }
    resizePlayable(width: number, height: number) {
        const verticalSize = playableSettings.resolution.vertical;

        const gameSize = verticalSize;
        const ratioW = width / gameSize[0];
        const ratioH = height / gameSize[1];
        this.scale = Math.min(ratioW, ratioH);

        this.gameContainer.scale.set(this.scale);
        this.gameContainer.position.x = width / 2;
        this.gameContainer.position.y = height / 2;

        this.uiContainer.position.x = 0;
        this.uiContainer.position.y = 0;

        this.bgContainer.position.x = width / 2;
        this.bgContainer.position.y = height / 2;

        if (this.bgEnvelopeSize != undefined) {
            const bgScale = Math.max(width / this.bgEnvelopeSize.x, height / this.bgEnvelopeSize.y);
            this.bgContainer.scale.set(bgScale, bgScale);
        }

        this.onRendererResized.forEach((obj) => {
            (obj['cb'] as Function)();
        });
    }
    addResizeCallback(cb: Function, id: string) {
        this.onRendererResized.push({
            cb: cb,
            id: id,
        });
    }
    removeResizeCallback(id: string) {
        for (let i = 0; i < this.onRendererResized.length; ++i) {
            if (this.onRendererResized[i].id == id) {
                this.onRendererResized.splice(i, 1);
                return;
            }
        }
    }
}
