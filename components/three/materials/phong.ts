import { Color, Material, MeshPhongMaterial } from 'three';

type PhongMaterialData = {
    color?: number;
    emissive?: number;
    specular?: number;
    shininess?: number;
    opacity?: number;
};

export const createPhongMaterial = (materialData: PhongMaterialData): Material => {
    const { color, emissive, specular, shininess } = materialData;
    const material = new MeshPhongMaterial();

    if (Object.keys(materialData).includes('color')) {
        material.color = new Color(color);
    }
    if (Object.keys(materialData).includes('emissive')) {
        material.emissive = new Color(emissive);
    }
    if (Object.keys(materialData).includes('specular')) {
        material.specular = new Color(specular);
    }
    if (Object.keys(materialData).includes('shininess')) {
        material.shininess = shininess || 0;
    }
    material.emissiveIntensity = 0.5;
    material.reflectivity = 0.5;
    return material;
};
