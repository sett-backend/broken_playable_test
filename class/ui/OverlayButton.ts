import { Game } from 'components/classes/game';
import { MonoBehavior } from 'components/classes/monoBehavior';
import { addResizeListener, onGameEnd, openStoreLink } from 'helper/adProtocols';
import { Container, Graphics } from 'pixi.js';

export class CTAButton extends MonoBehavior {
    graphics: Graphics;
    container: Container;
    constructor(timeout = 500) {
        super();
        this.resize = this.resize.bind(this);
        this.container = new Container();
        this.graphics = new Graphics();
        this.graphics.zIndex = 9999999;

        addResizeListener(this.resize, this._id);
        this.container.eventMode = 'static';

        onGameEnd();
        this.container.addChild(this.graphics);

        setTimeout(
            (self) => {
                self.container.on('pointerdown', openStoreLink);
            },
            timeout,
            this
        );
    }

    start(): void {
        Game.addToUI(this.container);
    }

    resize(width: number, height: number) {
        this.graphics.clear();
        this.graphics.beginFill(0x990000, 0.001);
        this.graphics.drawRect(30, 30, width - 60, height - 60);
    }
}
