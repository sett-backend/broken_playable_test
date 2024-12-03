import { Color, Material, MeshToonMaterial } from 'three';

type MeshToonMaterialData = {
    color?: number;
};

export const createMeshToonMaterial = (materialData: MeshToonMaterialData): Material => {
    const { color } = materialData;
    const material = new MeshToonMaterial();

    if (Object.keys(materialData).includes('color')) {
        material.color = new Color(color);
    }

    return material;
};
