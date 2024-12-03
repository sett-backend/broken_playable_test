import { UIItem } from 'root/class/ui/UIItem';

export class UIButton extends UIItem {
    clickCallback: () => void;
    maxScale = 9999;

    constructor(imageSrc: string, clickCallback: () => void) {
        super({
            src: imageSrc,
            enableInput: true,
            anchor: [50, 50],
            addToUI: false,
        });
        this.clickCallback = clickCallback;
    }
    onClick(): void {
        this.sprite.tint = '#cfcdca';
    }
    onRelease(): void {
        this.sprite.tint = '#ffffff';
    }
    onPressed(): void {
        this.clickCallback();
    }
    resize(width: number, height: number) {
        super.resize(width, height);
        const scale = Math.min(this.contentContainer.scale.x, this.maxScale);
        this.contentContainer.scale.set(scale, scale);
    }
}
