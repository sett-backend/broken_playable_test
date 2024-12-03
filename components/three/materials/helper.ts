import { Vector2, RepeatWrapping, Texture, TextureLoader } from 'three';

export function mapImage(image: THREE.Texture, uvTranslation = { x: 0, y: 0 }, uvScale = [1, 1], uvRotate = 0) {
    const newImage = image.clone();
    newImage.rotation = uvRotate;
    newImage.repeat.set(uvScale[0], uvScale[1]);
    newImage.offset = new Vector2(uvTranslation.x, uvTranslation.y);
    newImage.wrapS = RepeatWrapping;
    newImage.wrapT = RepeatWrapping;
    newImage.needsUpdate = true;

    return newImage;
}

export function colorRGB(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
        return {
            r: parseInt(result[1], 16) / 255,
            g: parseInt(result[2], 16) / 255,
            b: parseInt(result[3], 16) / 255,
        };
    }
    return null;
}

export function createTexture(image: string, cb: (texture: Texture) => void, onError?: (event: unknown) => void) {
    const loader = new TextureLoader();
    const err = onError || logError;
    loader.load(image, cb, undefined, err);
}

export function addShadow(model: THREE.Mesh, castShadow = true, receiveShadow = true) {
    model.castShadow = castShadow;
    model.receiveShadow = receiveShadow;
}

function logError(event: unknown) {
    console.error('cant load asset', event);
}
