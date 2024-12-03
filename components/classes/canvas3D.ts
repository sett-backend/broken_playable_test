import { MonoBehavior } from 'components/classes/monoBehavior';
import { addResizeListener } from 'helper/adProtocols';
import { getScreenSize } from 'helper/screen';
import {
    Object3D,
    Mesh,
    OrthographicCamera,
    PCFSoftShadowMap,
    SRGBColorSpace,
    Scene,
    Vector3,
    WebGLRenderer,
    ACESFilmicToneMapping,
} from 'three';

export class Canvas3D extends MonoBehavior {
    scene: Scene;
    camera: OrthographicCamera;
    renderer: WebGLRenderer;
    private frustumSize: number;

    constructor() {
        super();
        this.resize = this.resize.bind(this);
        this.update = this.update.bind(this);
        const { width, height } = getScreenSize();
        const container = document.createElement('div');
        container.style.pointerEvents = 'none';
        const game = document.getElementById('game');

        // container.classList.add('interactive_container');
        container.classList.add('canvas3d');
        container.setAttribute('id', 'canvas3d');
        game?.append(container);

        this.scene = new Scene();

        this.camera = new OrthographicCamera();
        this.scene.add(this.camera);
        this.frustumSize = 15;

        this.setCameraPosition(0, 10, 0);
        this.setCameraTarget(0, 0, 0);

        this.renderer = new WebGLRenderer({ antialias: true, alpha: true });

        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = PCFSoftShadowMap;
        this.renderer.outputColorSpace = SRGBColorSpace;
        this.renderer.toneMapping = 0;
        this.resize(width, height);

        if (container) {
            container.appendChild(this.renderer.domElement);
            this.renderer.render(this.scene, this.camera);
            addResizeListener(this.resize, 'ThreeScene');
        }
    }

    resize(width: number, height: number) {
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(width, height);

        const aspect = window.innerWidth / window.innerHeight;
        let frustum = this.frustumSize;
        if (aspect < 1.0) {
            frustum /= aspect;
        }

        this.camera.left = (frustum * aspect) / -2;
        this.camera.right = (frustum * aspect) / 2;
        this.camera.top = frustum / 2;
        this.camera.bottom = frustum / -2;
        this.camera.near = 0.1;
        this.camera.far = 5000;
    }
    add(obj: Object3D) {
        this.scene.add(obj);
    }
    remove(obj: Object3D) {
        this.scene.remove(obj);
    }
    update() {
        this.camera.clearViewOffset();
        this.renderer.render(this.scene, this.camera);
    }
    setFrustumSize(frustumSize: number) {
        this.frustumSize = frustumSize;
    }
    setCameraPosition(x = 0, y = 0, z = 0) {
        this.camera.position.set(x, y, z);
    }
    setCameraTarget(x = 0, y = 0, z = 0) {
        this.camera.lookAt(new Vector3(x, y, z));
    }
    removeFromScene(meshName: string) {
        try {
            const selectedObject = this.scene.getObjectByName(meshName);
            if (!(selectedObject instanceof Mesh)) return false;
            if (selectedObject.geometry) {
                selectedObject.geometry.dispose();
            }
            if (selectedObject.material) {
                if (selectedObject.material instanceof Array) {
                    selectedObject.material.forEach((material) => material.dispose());
                } else {
                    selectedObject.material.dispose();
                }
            }

            if (selectedObject.parent) {
                selectedObject.parent.remove(selectedObject);
            }
        } catch (error) {
            console.info('removeFromScene invalid', meshName, error);
        }
    }
}
