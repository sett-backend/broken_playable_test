import { Game } from 'components/classes/game';
import { MonoBehavior } from 'components/classes/monoBehavior';
import gsap from 'gsap';
import { addResizeListener } from 'helper/adProtocols';
import { Graphics } from 'pixi.js';

export class Overlay extends MonoBehavior {
    graphics: Graphics;

    constructor() {
        super();
        this.resize = this.resize.bind(this);
        this.graphics = new Graphics();
        addResizeListener(this.resize, this._id);
        this.graphics.alpha = 0;
    }

    start(): void {
        Game.addToUI(this.graphics);
        gsap.to(this.graphics, { alpha: 1, duration: 0.6, delay: 0.2 });
    }
    resize(width: number, height: number) {
        this.graphics.clear();
        this.graphics.beginFill(0x000000, 0.5);
        this.graphics.drawRect(0, 0, width, height);
    }
}
