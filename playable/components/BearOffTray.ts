import { MonoBehavior } from 'components/classes/monoBehavior';
import gsap from 'gsap';
import { Container, DisplayObject, Point, Sprite } from 'pixi.js';
import { Gfx } from '../assets';
import { Player } from '../constants';

const OFFSET = 11;
const SKEW = 0.7;
const SCALE = 0.6;

export class BearOffTray extends MonoBehavior {
    container: Container;
    private checkers: Sprite[] = [];
    private color: Player;
    private position: Point;
    constructor(x: number, y: number, color: Player) {
        super();
        this.container = new Container();
        this.position = new Point(x, y);
        this.color = color;
    }
    addChecker() {
        const newChecker = Sprite.from(this.color == Player.WHITE ? Gfx.checker_white_side : Gfx.checker_black_side);
        const direction = this.color == Player.WHITE ? -1 : 1;
        this.container.addChild(newChecker as DisplayObject);
        newChecker.anchor.set(0.5);
        newChecker.scale.set(SCALE);
        newChecker.position.copyFrom(this.position);
        newChecker.position.x += this.checkers.length * SKEW * direction;
        newChecker.position.y += this.checkers.length * OFFSET * direction;

        this.checkers.push(newChecker);
        return newChecker;
    }
    showWithAnim(checker: Sprite) {
        checker.visible = true;
        checker.scale.set(SCALE * 1.3);
        gsap.to(checker.scale, {
            x: SCALE,
            y: SCALE,
            duration: 0.5,
            ease: 'bounce.out',
        });
    }
}
