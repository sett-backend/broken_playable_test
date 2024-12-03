import { UIItem } from 'root/class/ui/UIItem';

export class UIImage extends UIItem {
    maxScalePortrait = 9999;
    maxScaleLandscape = 9999;
    constructor(imageSrc: string, addToUI = true) {
        super({
            src: imageSrc,
            anchor: [0.5, 0.5],
            size: [100, 100],
            position: [50, 50],
            zIndex: 30,
            addToUI: addToUI,
        });
    }
    resize(width: number, height: number) {
        super.resize(width, height);
        if (width >= height) {
            const scale = Math.min(this.contentContainer.scale.x, this.maxScaleLandscape);
            this.contentContainer.scale.set(scale, scale);
        } else {
            const scale = Math.min(this.contentContainer.scale.x, this.maxScalePortrait);
            this.contentContainer.scale.set(scale, scale);
        }
    }
}
