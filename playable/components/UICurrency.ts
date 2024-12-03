import { addResizeListener, removeResizeListener } from 'helper/adProtocols';
import { MonoBehavior } from 'components/classes/monoBehavior';
import { Text, TextStyle, Sprite, Container } from 'pixi.js';
import { Game } from 'components/classes/game';
import { Gfx } from '../assets';

const fontStyle = new TextStyle({
    fill: 0xfffebb,
    fontFamily: 'Potato',
    fontSize: 60,
    strokeThickness: 6,
    stroke: 0x512a00,
});

export class UICurrency extends MonoBehavior {
    text: Text;
    coinSprite: Sprite;
    coinSize = { x: 0, y: 0 };
    container: Container;
    screenResolution = { x: 0, y: 0 };
    position = { x: 0, y: 0 };
    pixelPosition = { x: -1, y: -1 };
    height = 5;
    scale: number = 1;
    constructor(posX: number, posY: number, height: number) {
        super();

        this.position = { x: posX, y: posY };
        this.height = height;

        const imageFile = new Image();
        const resolve = (res: { x: number; y: number }) => {
            this.coinSize = res;
            this.updateLayout();
        };
        imageFile.onload = function (e) {
            resolve({ x: imageFile.width, y: imageFile.height });
        };

        imageFile.src = Gfx.coin;
        this.resize = this.resize.bind(this);

        this.text = new Text('9999999', fontStyle);
        this.coinSprite = Sprite.from(Gfx.coin);
        this.coinSprite.anchor.set(0, 0);
        this.coinSprite.scale.set(0.5, 0.5);
        this.container = new Container();
        this.container.zIndex = 1;
        this.container.addChild(this.text);
        this.container.addChild(this.coinSprite);

        this.updateLayout();
        this.updateScreenPosition();
    }
    destroy(): void {
        super.destroy();
        removeResizeListener(this._id);
        this.container.removeAllListeners();
        this.container.removeChildren();
        this.container.removeFromParent();
        this.container.destroy();
    }
    start() {
        Game.addToUI(this.container);
        addResizeListener(this.resize, this._id);
    }
    setAmount(amount: number) {
        this.text.text = '' + amount;
        this.updateLayout();
    }
    updateScreenPosition() {
        this.container.scale.set(1, 1);
        const containerSize = {
            x: this.container.getBounds().width,
            y: this.container.getBounds().height,
        };

        const displayHeight = (this.height / 100) * this.screenResolution.y;
        const scale = (displayHeight / containerSize.y) * this.scale;
        this.container.scale.set(scale, scale);

        const bounds = this.container.getBounds();

        const pos = {
            x: this.pixelPosition.x != -1 ? this.pixelPosition.x : this.position.x * this.screenResolution.x,
            y: this.pixelPosition.y != -1 ? this.pixelPosition.y : this.position.y * this.screenResolution.y,
        };
        this.container.position.x = pos.x - bounds.width / 2;
        this.container.position.y = pos.y - bounds.height / 2;
    }
    private resize(width: number, height: number) {
        this.screenResolution = {
            x: width,
            y: height,
        };
        this.updateScreenPosition();
    }
    private updateLayout() {
        const coinSize = {
            x: this.coinSize.x * this.coinSprite.scale.x,
            y: this.coinSize.y * this.coinSprite.scale.y,
        };

        this.text.x = coinSize.x + 0;
        this.text.y = (coinSize.y - this.text.height) * 0.6;

        this.container.calculateBounds();
        this.updateScreenPosition();
    }
}
