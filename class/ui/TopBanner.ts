import { UIItem } from './UIItem';
import { openStoreLink } from 'helper/adProtocols';
import abanner from 'assets/ui/topBanner.png';

export class TopBanner extends UIItem {
    constructor() {
        super({ src: abanner, zIndex: 10, anchor: [0.5, 0] });
    }
    getSize(isHorizontal: boolean): [number, number] {
        return isHorizontal ? [100, 10] : [100, 30];
    }
    getPosition(isHorizontal: boolean): [number, number] {
        return isHorizontal ? [0, 0] : [50, 0];
    }
    getAnchor(isHorizontal: boolean): number | [number, number] {
        return isHorizontal ? 0 : [0.5, 0];
    }
    hideBanner() {
        this.container.removeChildren();
        this.destroy();
    }
    onClick(): void {
        openStoreLink();
    }
}
