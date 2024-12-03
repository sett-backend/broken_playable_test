import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { ThreeScene } from './scene';
import { Vector2, WebGLRenderer } from 'three';
import { addResizeListener } from 'helper/adProtocols';
import { MonoBehavior } from 'components/classes/monoBehavior';

export class Bloom extends MonoBehavior {
    composer: EffectComposer;
    renderer: WebGLRenderer;

    constructor(threeScene: ThreeScene) {
        super();
        this.renderer = threeScene.renderer;
        this.resize = this.resize.bind(this);
        const renderScene = new RenderPass(threeScene.scene, threeScene.camera);
        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(renderScene);
        const strength = 0.6;
        const radius = 0.2;
        const threshold = 0.5;
        const bloomPass = new UnrealBloomPass(
            new Vector2(window.innerWidth, window.innerHeight),
            strength,
            radius,
            threshold
        );
        this.composer.addPass(bloomPass);

        const outputPass = new OutputPass();
        this.composer.addPass(outputPass);
        addResizeListener(this.resize, 'bloomResize');
    }
    resize(width: number, height: number) {
        this.composer.setSize(width, height);
    }
    update(): void {
        this.composer.render();
    }
}
