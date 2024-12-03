import { loadGLB } from 'components/three/loaders';
import { LevelModels, LevelTextures } from 'root/playable/assetsList';
import { Group, Texture } from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { createTexture } from './materials/helper';

enum LoaderState {
    IDLE = 'idle',
    ERROR = 'error',
    PENDING = 'pending',
    SUCCESS = 'success',
}
export class LevelAssetsLoader {
    models = {} as { [key in LevelModels]: GLTF };
    textures = {} as { [key in LevelTextures]: Texture };
    assetsLoaded = 0;
    assetsToLoad = 0;
    onLoadCompleteFn = [] as (() => void)[];
    state = LoaderState.IDLE as LoaderState;

    constructor() {
        this.onProgress = this.onProgress.bind(this);
        this.loadModel = this.loadModel.bind(this);
        this.loadTexture = this.loadTexture.bind(this);
    }
    onLoadComplete(cb: () => void) {
        this.onLoadCompleteFn.push(cb);
    }
    get isIdle() {
        return this.state === LoaderState.IDLE;
    }

    loadModel(file: string, ref: LevelModels) {
        this.assetsToLoad++;
        if (this.isIdle) this.state = LoaderState.PENDING;

        loadGLB(
            file,
            (file) => {
                this.models[ref] = file;
                this.assetsLoaded++;
                this.onProgress();
            },
            this.setError
        );
    }
    setError() {
        this.state = LoaderState.ERROR;
    }
    loadTexture(file: string, ref: LevelTextures) {
        this.assetsToLoad++;
        if (this.isIdle) this.state = LoaderState.PENDING;
        createTexture(
            file,
            (file) => {
                this.textures[ref] = file;
                this.assetsLoaded++;
                this.onProgress();
            },
            this.setError
        );
    }
    onProgress() {
        if (this.assetsToLoad === this.assetsLoaded) {
            if (this.state !== LoaderState.ERROR) {
                this.state = LoaderState.SUCCESS;
                setTimeout(() => {
                    this.onLoadCompleteFn.forEach((cb) => cb());
                }, 100);
            } else {
                // console.log('error while loading assets');
            }
        }
    }
    getModel(ref: LevelModels): Group {
        return this.models[ref].scene;
    }
    getGLTF(ref: LevelModels): GLTF {
        return this.models[ref];
    }
    getTexture(imageName: LevelTextures) {
        return this.textures[imageName];
    }
    isLoaded() {
        return this.state === LoaderState.SUCCESS;
    }
}

export const assetsLoader = new LevelAssetsLoader();
