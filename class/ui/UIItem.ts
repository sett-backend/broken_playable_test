import { Game } from 'components/classes/game';
import { MonoBehavior } from 'components/classes/monoBehavior';
import { addResizeListener, removeResizeListener } from 'helper/adProtocols';
import { isArray } from 'lodash';
import { Container, FederatedPointerEvent, Sprite } from 'pixi.js';

export type UIItemSettings = {
    zIndex?: number;
    src: string;
    mask?: string;
    anchor?: number | [number, number];
    position?: [number, number];
    size?: [number, number];
    debug?: boolean;
    enableInput?: boolean;
    addToUI?: boolean;
};

export class UIItem extends MonoBehavior {
    container: Container;
    contentContainer: Container;
    resolution = { width: 0, height: 0 };
    anchor: number | [number, number];
    position: [number, number];
    size: [number, number];
    sprite: Sprite;
    mask?: Sprite;
    fill = 'contain' as 'cover' | 'contain' | 'stretch';
    debug = false;
    addToUI = true;
    constructor(uiSettings: UIItemSettings) {
        super();
        this.debug = !!uiSettings.debug;
        this.anchor = uiSettings.anchor || 0.5;
        this.position = uiSettings.position || [50, 50];
        this.size = uiSettings.size || [50, 50];
        if (uiSettings.addToUI != undefined) {
            this.addToUI = uiSettings.addToUI;
        }

        const imageFile = new Image();

        const resolve = (res: { width: number; height: number }) => {
            if (uiSettings.debug) console.log('res:', res);
            this.resolution = res;
            addResizeListener(this.resize, this._id);
        };
        imageFile.onload = function (e) {
            resolve({ width: imageFile.width, height: imageFile.height });
        };
        imageFile.src = uiSettings.src;
        this.container = new Container();
        this.contentContainer = new Container();
        this.contentContainer.sortableChildren = true;
        this.container.addChild(this.contentContainer);
        this.container.zIndex = uiSettings.zIndex || 1;

        if (uiSettings.enableInput) {
            this.container.eventMode = 'static';
            this.container.on('pointerdown', (event) => {
                this.onClick(event);
            });
            this.container.on('pointerup', () => {
                this.onRelease();
                if (this.container.alpha > 0 && this.container.visible && this.contentContainer.visible) {
                    this.onPressed();
                }
            });
            this.container.on('pointerupoutside', () => {
                this.onRelease();
            });
        }

        this.resize = this.resize.bind(this);
        this.sprite = Sprite.from(uiSettings.src);
        if (uiSettings.mask) {
            this.mask = Sprite.from(uiSettings.mask);
            this.addChild(this.mask);
            this.contentContainer.mask = this.mask;
        }
        this.addChild(this.sprite);
    }
    start(): void {
        if (this.addToUI) {
            Game.addToUI(this.container);
        }
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
        return this.size;
    }
    getPosition(isHorizontal: boolean): [number, number] {
        return this.position;
    }
    getAnchor(isHorizontal: boolean) {
        return this.anchor;
    }
    setSize(x: number, y: number) {
        this.size = [x * 100, y * 100];
    }
    setPosition(x: number, y: number) {
        this.position = [x * 100, y * 100];
    }
    setAnchor(x: number, y: number) {
        this.anchor = [x, y];
    }
    addChild(container: Container) {
        this.contentContainer.addChild(container);
    }
    setVisible(value: boolean) {
        this.contentContainer.visible = value;
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
    onClick(event: FederatedPointerEvent): void {}
    onRelease(): void {}
    onPressed(): void {}
}
