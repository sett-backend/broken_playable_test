import { Game } from 'components/classes/game';
import { MonoBehavior } from 'components/classes/monoBehavior';
import { addResizeListener, removeResizeListener } from 'helper/adProtocols';
import { isArray } from 'lodash';
import { Container, Sprite } from 'pixi.js';

export type UIItemSettings = {
    zIndex?: number;
    src: string;
    mask?: string;
    anchor?: number | [number, number];
    debug?: boolean;
    parent?: Container;
};

export class BgItem extends MonoBehavior {
    container: Container;
    parent?: Container;
    contentContainer: Container;
    resolution = { width: 0, height: 0 };
    anchor: number | [number, number];
    sprite: Sprite;
    mask?: Sprite;
    fill = 'contain' as 'cover' | 'contain' | 'stretch';
    debug = false;
    constructor(uiSettings: UIItemSettings) {
        super();
        this.debug = !!uiSettings.debug;
        this.anchor = uiSettings.anchor || 0.5;
        if (uiSettings.parent) this.parent = uiSettings.parent;

        const imageFile = new Image();

        const resolve = (res: { width: number; height: number }) => {
            this.log('res:', res);
            this.resolution = res;
            addResizeListener(this.resize, this._id);
        };
        imageFile.onload = function (e) {
            resolve({ width: imageFile.width, height: imageFile.height });
        };
        imageFile.src = uiSettings.src;
        this.container = new Container();
        this.container.position.x = -9999;

        this.contentContainer = new Container();
        this.contentContainer.sortableChildren = true;
        this.container.addChild(this.contentContainer);
        this.container.zIndex = uiSettings.zIndex || 1;

        if (Object.getPrototypeOf(this).onClick) {
            this.container.eventMode = 'static';
            Object.getPrototypeOf(this).onClick = Object.getPrototypeOf(this).onClick.bind(this);
            this.container.on('pointerdown', () => {
                Object.getPrototypeOf(this).onClick();
            });
        }
        this.resize = this.resize.bind(this);
        this.sprite = Sprite.from(uiSettings.src);
        if (isArray(this.anchor)) this.sprite.anchor.set(this.anchor[0], this.anchor[1]);
        else this.sprite.anchor.set(this.anchor);
        if (uiSettings.mask) {
            this.mask = Sprite.from(uiSettings.mask);
            this.addChild(this.mask);
            this.contentContainer.mask = this.mask;
        }
        this.addChild(this.sprite);
    }
    log(label: string, value: any) {
        if (this.debug) console.log(label, value);
    }
    start(): void {
        if (this.parent) this.parent.addChild(this.container);
        else Game.addToBackground(this.container);
    }
    resize(width: number, height: number) {
        if (!this._isActive) return;
        const anchor = this.getAnchor(width > height);
        if (isArray(anchor)) this.sprite.anchor.set(anchor[0], anchor[1]);
        else this.sprite.anchor.set(anchor);

        const sizeOnscreen = this.getSize(width > height); // [100,30]
        const position = this.getPosition(width > height);

        const displayRectWidth = (sizeOnscreen[0] / 100) * width;
        const displayRectHeight = (sizeOnscreen[1] / 100) * height;
        const ratio = this.resolution;
        const scaleW = displayRectWidth / ratio.width;
        const scaleH = displayRectHeight / ratio.height;
        if (this.fill === 'contain') this.contentContainer.scale.set(Math.min(scaleW, scaleH));
        else if (this.fill === 'cover') this.contentContainer.scale.set(Math.max(scaleW, scaleH));
        else this.contentContainer.scale.set(scaleW, scaleH);

        if (this.mask) {
            this.mask.anchor = this.sprite.anchor;
            this.mask.scale = this.sprite.scale;
        }

        this.container.position.x = (position[0] / 100) * width;
        this.container.position.y = (position[1] / 100) * height;
    }
    getSize(isHorizontal: boolean): [number, number] {
        return [100, 100];
    }
    getPosition(isHorizontal: boolean): [number, number] {
        return [50, 50];
    }
    getAnchor(isHorizontal: boolean) {
        return this.anchor;
    }
    addChild(container: Container) {
        this.contentContainer.addChild(container);
    }
    destroy(): void {
        if (!this._isActive) return;
        super.destroy();
        removeResizeListener(this._id);
        this.container.removeAllListeners();
        this.container.removeChildren();
        this.container.removeFromParent();
        this.container.destroy();
    }
}
