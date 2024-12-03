import { Time } from 'components/classes/gameTime';
import { MonoBehavior } from 'components/classes/monoBehavior';
import { lerp } from 'components/helper/math';
import { BlurFilter, Point, Rectangle, Sprite } from 'pixi.js';
import { Gfx } from '../assets';

const FRAME_SIZE = 128;
const MAX_BLUR = 3.0;
const SCALE = 0.6;

export class Die extends MonoBehavior {
    sprite: Sprite;
    blurFilter: BlurFilter;
    private frames = [0, 1, 2, 3, 4, 5];
    private rolling = false;
    private timer = 0;
    private frameTimer = 0;
    private rollDuration = 0;
    private previousFrame = -1;
    private finalFrame = 0;
    private movementPoints: Point[] = [];
    constructor(isWhite: boolean, movementPoints: Point[]) {
        super();
        this.movementPoints = movementPoints;
        this.sprite = Sprite.from(isWhite ? Gfx.dice_white : Gfx.dice_red);
        this.sprite.texture = this.sprite.texture.clone();
        this.sprite.texture.baseTexture.setSize(FRAME_SIZE * 6, FRAME_SIZE);
        this.sprite.texture.frame = new Rectangle(0, 0, FRAME_SIZE, FRAME_SIZE);
        this.sprite.anchor.set(0.5);
        this.sprite.scale.set(SCALE);

        this.blurFilter = new BlurFilter(0, 1);
        this.sprite.filters = [this.blurFilter];
    }
    update() {
        if (!this.rolling) return;

        const dt = Time.deltaTime;
        this.timer += dt;

        if (this.timer >= this.rollDuration) {
            this.rolling = false;
            this.setFrame(this.finalFrame);
        } else {
            const v = this.timer / this.rollDuration;

            // ANIMATING THE SPRITESHEET
            {
                if (this.timer >= 0.9) {
                    this.setFrame(this.finalFrame);
                } else {
                    const interval = lerp(0.1, 0.3, v * v * v);
                    this.frameTimer += dt;
                    if (this.frameTimer >= interval) {
                        while (this.frameTimer >= interval) {
                            this.frameTimer -= interval;
                        }
                        let randomFrame = -1;
                        do {
                            randomFrame = Math.floor(Math.random() * this.frames.length);
                        } while (randomFrame == this.previousFrame);
                        this.previousFrame = randomFrame;
                        this.setFrame(randomFrame);
                    }
                }
            }

            // MOVEMENT
            {
                const mv = 1 - Math.pow(1 - v, 3);
                const newPosition = this.getBezierPoint(this.movementPoints, mv);
                this.sprite.position.set(newPosition.x, newPosition.y);
                this.blurFilter.blur = (1 - mv) * MAX_BLUR;
            }

            // SCALING
            {
                const sv = v * 3 * Math.PI;
                const height = (1 - v) * 0.1;
                this.sprite.scale.set(SCALE + 1.0 * height * Math.abs(Math.sin(sv)));
            }
        }
    }
    roll(duration: number): number {
        this.rolling = true;
        this.rollDuration = duration;
        this.timer = 0;
        this.frameTimer = 0;
        this.finalFrame = Math.floor(Math.random() * this.frames.length);
        return this.finalFrame + 1;
    }
    rollNoAnim(result: number) {
        this.setFrame(result - 1);
        const point = this.movementPoints[this.movementPoints.length - 1];
        this.sprite.position.copyFrom(point);
    }
    private getBezierPoint(points: Point[], v: number): Point {
        if (points.length === 2) {
            return this.lerpPoint(points[0], points[1], v);
        }
        const reducedPoints: Point[] = [];
        for (let i = 0; i < points.length - 1; i++) {
            reducedPoints.push(this.lerpPoint(points[i], points[i + 1], v));
        }
        return this.getBezierPoint(reducedPoints, v);
    }
    private lerpPoint(p1: Point, p2: Point, v: number) {
        const x = (1 - v) * p1.x + v * p2.x;
        const y = (1 - v) * p1.y + v * p2.y;
        return new Point(x, y);
    }
    private setFrame(frame: number) {
        this.sprite.texture.frame = new Rectangle(frame * FRAME_SIZE, 0, FRAME_SIZE, FRAME_SIZE);
    }
}
