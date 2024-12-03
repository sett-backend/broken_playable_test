import { decode } from 'base64-arraybuffer';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const loader = new GLTFLoader();

export function loadGLB(model: string, callback: (model: GLTF) => void, onError?: () => void) {
    const glbData = decode(model.split(',')[1]);
    loader.parse(glbData, '', callback, (error) => {
        console.error(error);
        onError?.();
    });
}
