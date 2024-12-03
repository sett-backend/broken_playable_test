import { addResizeListener } from 'helper/adProtocols';
import { getScreenSize } from 'helper/screen';
import { Application } from 'pixi.js';
import { theme } from 'root/playable/theme';
import { MonoBehavior } from './classes/monoBehavior';

export class PixiRenderer extends MonoBehavior {
    app: Application;

    constructor() {
        super();

        this.onResize = this.onResize.bind(this);
        this.render = this.render.bind(this);
        const { width, height } = getScreenSize();
        this.app = new Application({
            width,
            height,
            resolution: window.devicePixelRatio,
            autoDensity: true,
            antialias: true,
            background: theme.background,
        });
        const container = document.getElementById('game');
        if (container) {
            container.appendChild(this.app.view);
            addResizeListener(this.onResize, 'rendererResize');
        } else {
            console.error('cant find #game in body');
        }
    }

    onResize(width: number, height: number) {
        this.app.renderer.resize(width, height);
    }
    render() {
        this.app.renderer.render(this.app.stage);
    }
}
