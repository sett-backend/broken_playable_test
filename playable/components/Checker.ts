import { MonoBehavior } from 'components/classes/monoBehavior';
import gsap from 'gsap';
import { Container, DisplayObject, Point, Sprite } from 'pixi.js';
import { Gfx } from '../assets';
import { Constants, Player } from '../constants';

export const CHECKER_SCALE = 0.4;

export type CheckerMoveData = {
    checker?: Checker;
    start: Point;
    end: Point;
    mid: Point;
    dist: number;
    duration: number;
};

export class Checker extends MonoBehavior {
    container: Container;
    sprite: Sprite;
    spriteHighlight: Sprite;
    position = 0; // progress on the board, between 0 and Constants.boardPointsCount-1
    pressCb?: (checker: Checker) => void;
    readonly color: Player;
    constructor(color: Player) {
        super();
        this.color = color;
        this.container = new Container();

        this.sprite = Sprite.from(color == Player.WHITE ? Gfx.checker_white : Gfx.checker_black);
        this.sprite.anchor.set(0.5);

        this.spriteHighlight = Sprite.from(Gfx.checker_green_highlight);
        this.spriteHighlight.anchor.set(0.5);
        this.spriteHighlight.visible = false;
        gsap.to(this.spriteHighlight, {
            alpha: 0.5,
            ease: 'power1.inOut',
            yoyo: true,
            repeat: -1,
        });

        this.container.addChild(this.sprite as DisplayObject);
        this.container.addChild(this.spriteHighlight as DisplayObject);

        this.sprite.scale.set(CHECKER_SCALE);
        this.spriteHighlight.scale.set(CHECKER_SCALE);
        // this.container.scale.set(CHECKER_SCALE);

        this.container.eventMode = 'static';
        this.container.on('pointerdown', this.onPressed.bind(this));
    }
    destroy() {
        this.container.destroy();
        super.destroy();
    }
    onPressed() {
        if (this.pressCb) {
            this.pressCb(this);
        }
    }
    getSize() {
        const size = Constants.checkerSize * this.sprite.scale.x * this.container.scale.x;
        return {
            x: size,
            y: size,
        };
    }
    setInputEnabled(value: boolean, pressCb?: (checker: Checker) => void) {
        this.pressCb = pressCb;
        this.spriteHighlight.visible = value;
    }
    move(targetPosition: Point, onFinished?: () => void, duration = 0.5): CheckerMoveData {
        //DESCRIPTION: Play animation of move run callback on complete
        const from = this.container.position;
        const midPoint = new Point((from.x + targetPosition.x) / 2, (from.y + targetPosition.y) / 2 - 30);

        const ease1 = 'none';
        const ease2 = 'none';

        gsap.to(this.container.position, {
            duration: duration / 2,
            x: midPoint.x,
            y: midPoint.y,
            ease: ease1,
        });
        gsap.to(this.container.scale, {
            duration: duration / 2,
            x: 1.3,
            y: 1.3,
            ease: ease1,
            onComplete: () => {
                gsap.to(this.container.position, {
                    duration: duration / 2,
                    x: targetPosition.x,
                    y: targetPosition.y,
                    ease: ease2,
                });
                gsap.to(this.container.scale, {
                    duration: duration / 2,
                    x: 1.0,
                    y: 1.0,
                    ease: ease2,
                    onComplete: () => {
                        if (onFinished) {
                            onFinished();
                        }
                    },
                });
            },
        });

        const distVec = new Point(targetPosition.x - from.x, targetPosition.y - from.y);
        const dist = Math.sqrt(distVec.x * distVec.x + distVec.y * distVec.y);
        return {
            checker: this,
            start: new Point(from.x, from.y),
            end: new Point(targetPosition.x, targetPosition.y),
            mid: midPoint,
            dist: dist,
            duration: duration,
        };
    }
}
