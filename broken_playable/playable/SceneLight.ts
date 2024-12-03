import { MonoBehavior } from 'components/classes/monoBehavior';
import { Game } from 'components/classes/game';
import * as THREE from 'three';
import { DirectionalLight } from 'three';

export class SceneLight extends MonoBehavior {
    constructor() {
        super();
    }

    start(): void {
        const skyLight = new THREE.AmbientLight(0xffffff, 5);
        const lightsGroup = new THREE.Group();
        Game.canvas3D?.scene.add(lightsGroup);

        lightsGroup.add(skyLight);

        const sunLight = new DirectionalLight(0xffffff, 1);
        sunLight.position.set(-40, 150, -40);
        sunLight.lookAt(0, 0, 0);

        // sunLight.castShadow = true;
        // sunLight.shadow.radius = 2;
        // sunLight.shadow.mapSize.width = 2560;
        // sunLight.shadow.mapSize.height = 2560;
        // sunLight.shadow.camera.near = 0.2;
        // sunLight.shadow.camera.far = 500;
        // sunLight.shadow.needsUpdate = true;
        lightsGroup.add(sunLight);

        // this.addShadowPlane();
    }
    // // create a plane that the shadows will be cast upon
    // addShadowPlane() {
    //     const shadowGeometry = new THREE.PlaneGeometry(200, 200);
    //     const shadowMaterial = new THREE.ShadowMaterial();
    //     shadowMaterial.opacity = 0.15;
    //     const shadowMesh = new THREE.Mesh(shadowGeometry, shadowMaterial);
    //     shadowMesh.receiveShadow = true;

    //     shadowMesh.rotation.x = -Math.PI / 2;
    //     shadowMesh.position.y = 0.01;

    //     Game.addToScene(shadowMesh);
    // }
}
