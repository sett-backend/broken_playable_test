import { Color, Material, MeshBasicMaterial, SRGBColorSpace, Texture } from 'three';
import { mapImage } from './helper';

type MeshBasicMaterialData = {
    color?: number;
    map?: Texture;
    transparent?: boolean;
    opacity?: number;
    uvRotate?: number;
    uvScale?: [number, number];
    uvTranslation?: { x: number; y: number };
};

export const createBasicMaterial = (materialData: MeshBasicMaterialData): Material => {
    const { color, map, transparent, opacity, uvRotate, uvScale, uvTranslation } = materialData;

    const material = new MeshBasicMaterial();

    if (map) {
        material.map = mapImage(map, uvTranslation, uvScale, uvRotate);
        material.map.flipY = false;
        material.map.colorSpace = SRGBColorSpace;
    }

    if (Object.keys(materialData).includes('color')) {
        material.color = new Color(color);
    }
    if (Object.keys(materialData).includes('transparent')) {
        material.transparent = !!transparent;
    }
    if (Object.keys(materialData).includes('opacity')) {
        material.opacity = opacity as number;
    }
    return material;
};
