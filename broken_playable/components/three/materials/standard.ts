import * as THREE from 'three';
import { mapImage } from './helper';

type StandardMaterialData = {
    diffuse?: THREE.Texture;
    color?: number;
    normalMap?: THREE.Texture;
    alphaMap?: THREE.Texture;
    uvRotate?: number;
    uvScale?: [number, number];
    uvTranslation?: { x: number; y: number };
    roughness?: number;
    metalness?: number;
    emissive?: number;
    opacity?: number;
    transparent?: boolean;
};

export const createStandardMaterial = (materialData: StandardMaterialData): THREE.Material => {
    const {
        diffuse,
        uvScale,
        uvTranslation,
        uvRotate,
        color,
        normalMap,
        alphaMap,
        roughness,
        metalness,
        emissive,
        transparent,
        opacity = 1,
    } = materialData;
    const material = new THREE.MeshStandardMaterial();

    if (diffuse) {
        material.map = mapImage(diffuse, uvTranslation, uvScale, uvRotate);
        material.map.flipY = false;
        material.map.colorSpace = THREE.SRGBColorSpace;
    }
    if (Object.keys(materialData).includes('color')) {
        material.color = new THREE.Color(color);
    }
    if (Object.keys(materialData).includes('transparent')) {
        material.transparent = !!transparent;
    }
    if (normalMap) {
        material.normalMap = mapImage(normalMap, uvTranslation, uvScale, uvRotate);
        material.normalMap.flipY = false;
    }
    if (alphaMap) {
        material.transparent = true;
        material.alphaMap = mapImage(alphaMap, uvTranslation, uvScale, uvRotate);
        material.alphaMap.flipY = false;
    }
    if (roughness) {
        material.roughness = roughness;
    }
    if (metalness) {
        material.metalness = metalness;
    }
    if (Object.keys(materialData).includes('emissive')) {
        material.emissive = new THREE.Color(emissive);
    }
    if (opacity < 1) {
        material.opacity = opacity;
        material.transparent = true;
    }
    return material;
};
