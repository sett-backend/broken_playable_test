import { Game } from 'components/classes/game';
import { SoundManager, setVolumeListener } from 'components/managers/soundManager';
import { noop } from 'lodash';
import { getScreenSize, refreshScreenSize } from './screen';

export enum ProtocolTypes {
    NONE = 'none',
    MRAID = 'mraid',
    DAPI = 'dapi',
    FACEBOOK = 'facebook',
    GOOGLE = 'google',
    MINDWORKS = 'mindworks',
}

let adProtocol = ProtocolTypes.NONE;

export function isMraid() {
    return adProtocol === ProtocolTypes.MRAID;
}
export function isDapi() {
    return adProtocol === ProtocolTypes.DAPI;
}
export function isFacebook() {
    return adProtocol === ProtocolTypes.FACEBOOK;
}
export function isGoogle() {
    return adProtocol === ProtocolTypes.GOOGLE;
}
export function isDesktop() {
    return adProtocol === ProtocolTypes.NONE;
}
export function isMindworks() {
    return adProtocol === ProtocolTypes.MINDWORKS;
}

let isStarted = false;
let isInitialized = false;

let initialCallback = noop;

let androidLink = '';
let iosLink = '';

export function init(callback: () => void) {
    setProtocol();
    initialCallback = () => {
        isInitialized = true;

        callback();
    };

    const onReadyCallback = () => {
        removeOnReady(onReadyCallback);
        onDocumentVisible();
        createVisibleListeners();
        createResizeListener();
        createInteractionListener();
        setVolumeListener();
    };
    onReady(() => setTimeout(onReadyCallback, 800));
}

function setProtocol() {
    try {
        mraid.getState();
        adProtocol = ProtocolTypes.MRAID;
        return;
        // eslint-disable-next-line no-empty
    } catch (error) {}

    try {
        dapi.isReady();
        adProtocol = ProtocolTypes.DAPI;
        return;
        // eslint-disable-next-line no-empty
    } catch (error) {}
    try {
        if (FbPlayableAd) {
            adProtocol = ProtocolTypes.FACEBOOK;
            return;
        }
        // eslint-disable-next-line no-empty
    } catch (error) {}

    try {
        if (ExitApi) {
            adProtocol = ProtocolTypes.GOOGLE;
            return;
        }
        // eslint-disable-next-line no-empty
    } catch (error) {}
    try {
        if (window.gameReady) {
            adProtocol = ProtocolTypes.MINDWORKS;
            return;
        }
        // eslint-disable-next-line no-empty
    } catch (error) {}
    adProtocol = ProtocolTypes.NONE;
}

export function getAppLink() {
    return isAndroid() ? androidLink : iosLink;
}
function createVisibleListeners() {
    switch (adProtocol) {
        case ProtocolTypes.DAPI:
            dapi.addEventListener('viewableChange', onDocumentVisible);
            break;
        case ProtocolTypes.MRAID:
            mraid.addEventListener('viewableChange', onDocumentVisible);
            break;
        default:
            document.addEventListener('visibilitychange', onDocumentVisible);
            break;
    }
}

const resizeFunction = {} as { [key: string]: (width: number, height: number) => void };
export function resizeEvent(callback: (width: number, height: number) => void) {
    setTimeout(
        (callback) => {
            const { width, height } = getScreenSize();
            callback(width, height);
        },
        120,
        callback
    );
}

export function addResizeListener(callback: (width: number, height: number) => void, key: string, hideWarning = false) {
    if (!resizeFunction[key]) {
        resizeEvent(callback);
    } else if (!hideWarning) {
        console.error('resize function overwritten', key);
    }
    resizeFunction[key] = callback;
}

export function removeResizeListener(key: string) {
    delete resizeFunction[key];
}

let resizeTimeout: NodeJS.Timeout;

function resizeView() {
    if (resizeTimeout) {
        clearTimeout(resizeTimeout);
    }
    resizeTimeout = setTimeout(resizeGame, 250);
}
const resizeGame = () => {
    const { width, height } = refreshScreenSize();
    if (width * height === 0) {
        resizeView();
    } else {
        Object.keys(resizeFunction).forEach((fnKey) => resizeFunction[fnKey](width, height));
    }
};
function createResizeListener() {
    resizeView();
    if (isFacebook()) {
        return;
    }
    switch (adProtocol) {
        case ProtocolTypes.DAPI:
            dapi.addEventListener('adResized', resizeView);
            break;
        case ProtocolTypes.MRAID:
            mraid.addEventListener('sizeChange', resizeView);
            break;
        default:
            window.onresize = resizeView;
            break;
    }
}

export function openStoreLink() {
    const appLink = getAppLink();
    switch (GA_ENVIRONMENT) {
        case 'MOLOCO':
            FbPlayableAd.onCTAClick();
            return;
        case 'VUNGLE':
            parent.postMessage('download', '*');
            break;
    }

    switch (adProtocol) {
        case ProtocolTypes.DAPI:
            dapi.openStoreUrl();
            return;
        case ProtocolTypes.MRAID:
            mraid.open(appLink);
            return;
        case ProtocolTypes.FACEBOOK:
            FbPlayableAd.onCTAClick();
            return;
        case ProtocolTypes.GOOGLE:
            ExitApi.exit();
            return;
        case ProtocolTypes.MINDWORKS:
            window.install && window.install();
            return;
        default:
            window.open(appLink);
            return;
    }
}

export function isAndroid() {
    return window.navigator.userAgent.toLowerCase().includes('android');
}
export function isIOS() {
    const platform = window.navigator?.userAgentData?.platform || window.navigator.platform;
    const ios = /iphone|ipod|ipad/.test(platform);
    return ios;
}
export function getOS() {
    if (isAndroid()) {
        return 'android';
    }
    if (isIOS()) {
        return 'ios';
    }
    return 'desktop';
}
let isMutedOnVisible = false;
function onDocumentVisible() {
    if (isVisible()) {
        if (!isInitialized) {
            initialCallback();
        }
        SoundManager.mute(isMutedOnVisible);
        Game.play();
    } else {
        isMutedOnVisible = SoundManager.soundMuted;
        SoundManager.mute(true);
        Game.pause();
    }
}
export function isVisible() {
    if (isStarted) {
        switch (adProtocol) {
            case ProtocolTypes.DAPI:
                return dapi.isViewable();
            case ProtocolTypes.MRAID:
                return mraid.isViewable();
        }
        return document.visibilityState === 'visible';
    }
    return false;
}

function onReady(callback: () => void) {
    switch (adProtocol) {
        case ProtocolTypes.DAPI:
            if (dapi.isReady()) {
                onProtocolStart(callback);
            } else {
                dapi.addEventListener('ready', () => onProtocolStart(callback));
            }
            break;
        case ProtocolTypes.MRAID:
            if (mraid.getState() === 'default') {
                onProtocolStart(callback);
            } else {
                mraid.addEventListener('ready', () => onProtocolStart(callback));
            }
            break;
        case ProtocolTypes.MINDWORKS:
            document.addEventListener('mindworks_gameStart', () => onProtocolStart(callback));
            document.addEventListener('mindworks_gameStart', onGameClose);
            window.gameReady && window.gameReady();
            break;
        default:
            onProtocolStart(callback);
            break;
    }
}
function removeOnReady(callback: () => void) {
    switch (adProtocol) {
        case ProtocolTypes.DAPI:
            dapi.removeEventListener('ready', () => callback());
            break;
        case ProtocolTypes.MRAID:
            mraid.removeEventListener('ready', () => callback());
            break;
    }
}
export function setLinks(links: { ios: string; android: string }) {
    if (!links.ios.includes('https://apps.apple.com/')) {
        console.error('%c check IOS link' + links.ios, 'font-size: 20px');
    }
    if (!links.android.includes('https://play.google.com')) {
        console.error('%c check Android link' + links.android, 'font-size: 20px');
    }

    androidLink = links.android;
    iosLink = links.ios;
}
export function addDebug(label: string, value: string | number | boolean) {
    value = value.toString();
    let debugContainer = document.getElementById('debug');
    if (!debugContainer) {
        debugContainer = document.createElement('div');

        //Set its unique ID.
        debugContainer.id = 'debug';
        debugContainer.setAttribute(
            'style',
            'color: white; background: #000; position: absolute; top: 0; left:0; z-index:9999999; width: calc(100% - 40px); opacity: 0.8; padding: 20px'
        );
        debugContainer.innerHTML = '';
        document.body.appendChild(debugContainer);
    }

    const debugParameter = document.createElement('p');
    debugParameter.innerHTML = `${label}:${value}`;
    debugContainer.appendChild(debugParameter);
    setTimeout(
        (element) => {
            element.remove();
            if (debugContainer?.childElementCount === 0) {
                debugContainer.remove();
            }
        },
        4000,
        debugParameter
    );
}

export function onGameEnd() {
    if (isMindworks()) {
        window.gameEnd && window.gameEnd();
    }
    if (GA_ENVIRONMENT === 'VUNGLE') {
        parent.postMessage('complete', '*');
    }
}

function onGameClose() {
    SoundManager.mute(true);
}
function onProtocolStart(callback: () => void) {
    isStarted = true;
    callback();
}

function createInteractionListener() {
    document.addEventListener('touchstart', firstInteraction);
    document.addEventListener('mousedown', firstInteraction);
}

let gameTouched = false;

export function hasFirstInteraction() {
    return gameTouched;
}
export function firstInteraction() {
    if (!gameTouched) {
        document.removeEventListener('touchstart', firstInteraction);
        document.removeEventListener('mousedown', firstInteraction);
        setTimeout(() => {
            gameTouched = true;
        }, 200);
    }
}
