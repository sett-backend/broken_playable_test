import { MonoBehavior } from './monoBehavior';

export class GameLoader extends MonoBehavior {
    loader: Element;

    constructor() {
        super();
        this.loader = document.createElement('div');
        this.loader.classList.add('playable-loader-container');
        this.loader.innerHTML = '<div class="playable-loader-logo"></div><div class="playable-loader-spinner"></div>';
    }
    start() {
        document.body.append(this.loader);
        document.getElementsByClassName('playable-loader-logo')[0];
    }
    remove() {
        setTimeout(
            (element) => {
                element.classList.add('playable-loader-container-hide');
            },
            100,
            this.loader
        );

        setTimeout(
            (element) => {
                element.remove();
                this.destroy();
            },
            440,
            this.loader
        );
    }
}
