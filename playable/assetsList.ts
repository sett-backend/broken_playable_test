import { assetsLoader } from 'root/class/three/levelAssetsLoader';

import die_red from 'assets/models/die_red.glb';
import die_white from 'assets/models/die_white.glb';

import palette_texture from 'assets/models/palette.png';

export type AssetItem = { src: string; resolution: [number, number] };

export enum LevelModels {
    DIE_RED,
    DIE_WHITE,
}

export enum LevelTextures {
    PALETTE,
}

export const loadAllAssets = () => {
    assetsLoader.loadModel(die_red, LevelModels.DIE_RED);
    assetsLoader.loadModel(die_white, LevelModels.DIE_WHITE);
    assetsLoader.loadTexture(palette_texture, LevelTextures.PALETTE);
};
