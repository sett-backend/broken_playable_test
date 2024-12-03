import { isDapi, isMraid } from './adProtocols';
let uiWidth = 0;
let uiHeight = 0;
let screenWidth = 0;
let screenHeight = 0;

export function setUIWidth(size: number) {
    uiWidth = size;
}
export function setUIHeight(size: number) {
    uiHeight = size;
}
export function getUIWidth() {
    return uiWidth;
}
export function getUIHeight() {
    return uiHeight;
}

export function getUIDimensions() {
    return [uiWidth, uiHeight];
}
export function getScreenSize() {
    if (screenWidth * screenHeight === 0) {
        return refreshScreenSize();
    }
    return {
        width: screenWidth,
        height: screenHeight,
    };
}
export function refreshScreenSize() {
    if (isMraid()) {
        const mraidSize = mraid.getScreenSize();
        screenWidth = mraidSize.width;
        screenHeight = mraidSize.height;
    } else if (isDapi()) {
        const dapiScreen = dapi.getScreenSize();
        screenWidth = dapiScreen.width;
        screenHeight = dapiScreen.height;
    } else {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        screenWidth = windowWidth;
        screenHeight = windowHeight;
    }
    return { width: screenWidth, height: screenHeight };
}
export enum CanvasOrientation {
    HORIZONTAL = 'Horizontal',
    VERTICAL = 'Vertical',
}

export function getOrientation() {
    const { width, height } = getScreenSize();
    return width > height ? CanvasOrientation.HORIZONTAL : CanvasOrientation.VERTICAL;
}

export function isHorizontal() {
    return getOrientation() === CanvasOrientation.HORIZONTAL;
}
export function isVertical() {
    return getOrientation() === CanvasOrientation.VERTICAL;
}
export function getSizeByScreenWidth(value: number) {
    const valuePrc = value / 100;
    const edge = uiWidth;
    return valuePrc * edge;
}
export function getSizeByScreenHeight(value: number) {
    const valuePrc = value / 100;
    const edge = uiHeight;
    return valuePrc * edge;
}
