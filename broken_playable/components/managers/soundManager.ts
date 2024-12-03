import { v4 as uuid } from 'uuid';
import { Howl } from 'howler';
import { hasFirstInteraction, isDapi } from 'helper/adProtocols';

type SoundElements = { [name: string]: { instance: Howl; soundData: SoundFile } };

export type SoundConfigSet = {
    loop?: boolean;
    autoplay?: boolean;
    volume?: number;
    timeout?: number;
    name?: string;
    force?: boolean;
    vibrate?: number | number[];
};
export type SoundConfig = {
    loop: boolean;
    autoplay: boolean;
    volume: number;
    timeout: number;
    name: string;
    force: boolean;
    vibrate: number | number[];
};
const defaultSoundConfig = {
    volume: 1,
    loop: false,
    autoPlay: false,
    force: false,
    timeout: 0,
    name: '',
    vibrate: 0,
    autoplay: false,
} as SoundConfigSet;

export type SoundFile = {
    src: string;
    loop: boolean;
    volume: number;
};
class SoundController {
    initialized: boolean;
    soundsList: SoundElements;
    volume: number;
    soundMuted = false;

    constructor() {
        this.initialized = false;
        this.soundsList = {} as SoundElements;
        this.volume = 1;
        this.init = this.init.bind(this);
        this.play = this.play.bind(this);
        this.mute = this.mute.bind(this);
        this.setVolume = this.setVolume.bind(this);
    }

    play(file: string, userConfig = defaultSoundConfig) {
        const config = { ...defaultSoundConfig, ...userConfig } as SoundConfig;
        if (this.soundMuted) return;

        if (!config.name) config.name = uuid();

        if (!soundActive()) {
            if (config.force) {
                setTimeout((sm) => sm.play(file, config), 300, this);
                return;
            } else {
                return;
            }
        }
        let soundItem = this.soundsList[config.name];

        if (!soundItem) {
            soundItem = this.init(file, config);
        }
        if (!soundItem) {
            return;
        }
        if (config.timeout) {
            setTimeout((sm) => sm.play(file, { ...config, timeout: 0 }), config.timeout, this);
        } else {
            soundItem.instance.play();
            if (config.vibrate) {
                try {
                    navigator.vibrate(config.vibrate);
                } catch (error) {}
            }
        }
    }
    mute(muteStatus: boolean) {
        if (muteStatus) {
            this.soundMuted = true;
            Object.keys(this.soundsList).forEach((soundKey) => {
                const soundItem = this.soundsList[soundKey];
                soundItem.instance.pause();
            });
        } else {
            this.soundMuted = false;
            Object.keys(this.soundsList).forEach((soundKey) => {
                const soundItem = this.soundsList[soundKey];
                if (soundItem.soundData.loop) soundItem.instance.play();
            });
        }
    }
    setVolume(volumeValue?: number) {
        if (volumeValue) {
            if (this.soundMuted) this.mute(false);
            this.volume = volumeValue;
            this.soundMuted = false;
            Object.keys(this.soundsList).forEach((soundKey) => {
                const soundItem = this.soundsList[soundKey];
                soundItem.instance.volume(volumeValue * (soundItem.soundData.volume || 1));
            });
        } else {
            this.mute(true);
        }
    }
    init(soundFile: string, config: SoundConfig) {
        const newHowlSoundSrc = new Howl({
            src: [soundFile],
            loop: config.loop,
            volume: config.volume,
            autoplay: config.autoplay,
        });
        this.soundsList[config.name] = {
            instance: newHowlSoundSrc,
            soundData: { src: soundFile, loop: !!config.loop, volume: config.volume || 1 },
        };

        return this.soundsList[config.name];
    }
}
export function setVolumeListener() {
    if (isDapi()) {
        const volume = dapi.getAudioVolume();
        if (volume) SoundManager.setVolume(volume);
        else SoundManager.setVolume(0);

        dapi.addEventListener('audioVolumeChange', SoundManager.setVolume);
    }
}
export const SoundManager = new SoundController();

function soundActive() {
    return hasFirstInteraction();
}
