import {
    AnimationMixer,
    AnimationClip,
    Group,
    Mesh,
    Vector3,
    LoopOnce,
    MeshStandardMaterial,
    AnimationAction,
} from 'three';
import { assetsLoader } from 'root/class/three/levelAssetsLoader';
import { LevelModels, LevelTextures } from '../assetsList';
import { MonoBehavior } from 'components/classes/monoBehavior';
import { Time } from 'components/classes/gameTime';
import { createStandardMaterial } from 'components/three/materials/standard';
import { Player } from '../constants';

export class Die3d extends MonoBehavior {
    group: Group;
    mixer?: AnimationMixer;
    anims: AnimationClip[] = [];
    meshes: Mesh[] = [];
    opacity = 1;
    clips: { [key: string]: AnimationAction } = {};

   //DESCRIPTION: dices 3d, animation for each value in GLB file

    constructor(player: Player) {
        super();
        this.group = new Group();
        const scale = 0.8;
        this.group.scale.set(scale, scale, scale);

        const offset = new Vector3(0, 0, 0);
        const model = assetsLoader.getGLTF(player == Player.WHITE ? LevelModels.DIE_RED : LevelModels.DIE_WHITE);
        const scene = model.scene.clone();
        this.mixer = new AnimationMixer(scene);
        this.anims = model.animations;
        for (const mesh of scene.children) {
            (mesh as Mesh).material = createStandardMaterial({
                diffuse: assetsLoader.getTexture(LevelTextures.PALETTE),
                metalness: 0.5,
                roughness: 0.1,
                transparent: true,
            });
            this.meshes.push(mesh as Mesh);
            offset.set(-mesh.position.x, -mesh.position.y, -mesh.position.z);
        }
        scene.position.copy(offset);
        this.group.add(scene);

        for (let i = 0; i < this.anims.length; ++i) {
            const clip = this.mixer?.clipAction(this.anims[i]);
            if (clip) {
                clip.setLoop(LoopOnce, 1);
                clip.clampWhenFinished = true;
                this.clips[this.anims[i].name] = clip;
            }
        }
    }
    update(): void {
        this.mixer?.update(Time.deltaTime * 3);
        for (const mesh of this.meshes) {
            const mat = mesh.material as MeshStandardMaterial;
            mat.opacity = this.opacity;
        }
    }
    playAnim(animName: string) {
        //DESCRIPTION: play animation from GLB        
        this.mixer?.stopAllAction();
        const clip = this.clips[animName];
        clip.reset();
        clip.play();
    }
    playEnd(animName: string) {
        let duration = 0;
        for (let i = 0; i < this.anims.length; ++i) {
            if (this.anims[i].name == animName) {
                duration = this.anims.length;
                break;
            }
        }
        this.mixer?.stopAllAction();
        const clip = this.clips[animName];

        clip.play();
        clip.time = duration;
        clip.paused = true;
    }
}
