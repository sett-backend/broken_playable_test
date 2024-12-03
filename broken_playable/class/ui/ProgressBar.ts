import { Container, Graphics } from 'pixi.js';
import { MonoBehavior } from 'components/classes/monoBehavior';
import { UIItem } from 'root/class/ui/UIItem';

const WIDTH = 500;
const HEIGHT = 80;
const RADIUS = 30;
const BORDER = 6;

export class ProgressBar extends MonoBehavior {
    container: Container;
    mask: Graphics;
    background: Graphics;
    progress: Graphics;
    parent: UIItem;

    constructor(parent: UIItem, fill: number) {
        super();
        this.setProgress = this.setProgress.bind(this);
        this.container = new Container();
        this.container.zIndex = -1;
        this.mask = new Graphics();
        this.background = new Graphics();

        const progressContainer = new Container();
        this.progress = new Graphics();
        this.progress.beginFill(fill);
        this.progress.drawRect(0, 0, WIDTH, HEIGHT);
        this.progress.position.x = -WIDTH / 2;
        this.progress.position.y = -HEIGHT / 2;

        progressContainer.addChild(this.progress);

        this.container.addChild(this.mask);
        this.container.addChild(this.background);
        this.container.addChild(progressContainer);
        progressContainer.mask = this.mask;
        this.parent = parent;
        this.parent.addChild(this.container);
    }
    start(): void {
        this.background.beginFill(0x000000);
        this.background.drawRoundedRect(-WIDTH / 2, -HEIGHT / 2, WIDTH, HEIGHT, RADIUS);
        this.background.endFill();
        this.background.lineStyle({ color: 0xffffff, width: BORDER, alignment: 1 });
        this.background.drawRoundedRect(-WIDTH / 2, -HEIGHT / 2, WIDTH, HEIGHT, RADIUS);

        this.mask.beginFill(0x990000, 1);
        this.mask.drawRoundedRect(-WIDTH / 2, -HEIGHT / 2, WIDTH, HEIGHT, RADIUS);
    }
    setProgress(prc: number) {
        this.progress.scale.x = prc;
    }
}
