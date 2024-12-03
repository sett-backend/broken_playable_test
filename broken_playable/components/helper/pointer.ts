import { isDesktop } from 'helper/adProtocols';

export const isTouchDevice = () => {
    if (isDesktop()) {
        return 'ontouchstart' in window;
    } else {
        return true;
    }
};

export const getPointerPosition = (e: MouseEvent) => {
    return { x: e.clientX, y: e.clientY };
};
