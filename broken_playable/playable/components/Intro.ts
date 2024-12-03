import { MonoBehavior } from 'components/classes/monoBehavior';
import { Graphics, DisplayObject, Sprite, Point, LINE_CAP } from 'pixi.js';
import { Audio, Gfx } from '../assets';
import { Board } from './Board';
import { Checker, CheckerMoveData } from './Checker';
import gsap from 'gsap';

export class Intro extends MonoBehavior {
    checkers: Checker[];
    tutorialLines: Graphics[];
    tutorialLineDatas: (CheckerMoveData | undefined)[] = [undefined, undefined];
    updateTutorialLine = [false, false];
    board: Board;
    tutorialDice: Sprite;
    finishedCb: () => void;
     
    //DESCRIPTION: Intro animation
    
    constructor(introCheckers: Checker[], board: Board, finishedCb: () => void) {
        super();
        const introCheckerIndex = board.getChildIndex(introCheckers[1].container as DisplayObject);
        this.tutorialLines = [new Graphics(), new Graphics()];
        for (const line of this.tutorialLines) {
            board.addChildAt(line as DisplayObject, introCheckerIndex);
        }
        this.tutorialLineDatas[0] = {
            start: new Point(0, 0),
            mid: new Point(0, 0),
            end: new Point(0, 0),
            dist: 0,
            duration: 0,
        };

        this.tutorialDice = Sprite.from(Gfx.intro_dice);
        this.tutorialDice.anchor.set(0.5);
        this.tutorialDice.position.set(-180, -30);
        this.tutorialDice.scale.set(0.7);
        board.addChildAt(this.tutorialDice as DisplayObject, introCheckerIndex);

        this.checkers = introCheckers;
        this.board = board;
        this.finishedCb = finishedCb;
    }
    play() {
        const checkerHighlight = Sprite.from(Gfx.checker_tutorial_highlight);
        checkerHighlight.anchor.set(0.5);
        checkerHighlight.scale.set(0.45);
        this.checkers[0].container.addChildAt(checkerHighlight as DisplayObject, 0);
        //DESCRIPTION: Intro movement of checkers
        const delayBetweenMovements = 0.2;
        this.moveChecker(12, delayBetweenMovements, () => {
            this.fadeOutTutorialLine(0, delayBetweenMovements);
            this.moveChecker(18, delayBetweenMovements, () => {
                this.fadeOutTutorialLine(0, delayBetweenMovements);
                gsap.delayedCall(delayBetweenMovements, () => {
                    Audio.play('checkrs_tap');
                    this.board.removeChecker(this.checkers[0]);
                    this.tutorialLineDatas[0] = this.board.moveCheckerToTray(this.checkers[0]);
                    this.updateTutorialLine[0] = true;
                    this.tutorialLines[0].clear();
                    this.tutorialLines[1].clear();
                    this.tutorialLines[0].alpha = 1.0;
                    this.tutorialLines[1].alpha = 1.0;
                    gsap.delayedCall(this.tutorialLineDatas[0].duration, () => {
                        this.fadeOutTutorialLine(0, delayBetweenMovements);
                    });

                    gsap.delayedCall(0.25, () => {
                        this.updateTutorialLine[1] = true;
                        Audio.play('checkrs_tap');
                        this.board.removeChecker(this.checkers[1]);
                        this.tutorialLineDatas[1] = this.board.moveCheckerToTray(this.checkers[1]);
                        gsap.delayedCall(this.tutorialLineDatas[1].duration, () => {
                            this.fadeOutTutorialLine(1, delayBetweenMovements);
                        });
                    });

                    gsap.delayedCall(1.0, () => {
                        gsap.to(this.tutorialDice, {
                            alpha: 0,
                            duration: 0.5,
                        });

                        this.finishedCb();
                    });
                });
            });
        });
    }
    moveChecker(newPosition: number, delay: number, onFinished: () => void) {
        gsap.delayedCall(delay, () => {
            Audio.play('checkers_slide');
            this.updateTutorialLine[0] = true;
            this.tutorialLines[0].clear();
            this.tutorialLines[0].alpha = 1.0;
            this.checkers[0].position = newPosition;
            const targetPos = this.board.getCheckerPosition(this.checkers[0]);
            this.tutorialLineDatas[0] = this.checkers[0].move(targetPos, onFinished, 0.5);
        });
    }
    fadeOutTutorialLine(i: number, duration: number) {
        this.updateTutorialLine[i] = false;
        gsap.to(this.tutorialLines[i], {
            alpha: 0,
            duration: duration,
        });
    }
    update(): void {
        for (let i = 0; i < 2; ++i) {
            const data = this.tutorialLineDatas[i];
            if (data == undefined || !this.updateTutorialLine[i]) {
                continue;
            }
            this.tutorialLines[i].clear();
            const vec = new Point(data.end.x - data.start.x, data.end.y - data.start.y);
            const vecLen = Math.sqrt(vec.x * vec.x + vec.y * vec.y);
            vec.x /= vecLen;
            vec.y /= vecLen;
            const perpVec = new Point(vec.y, -vec.x);

            this.drawTutorialLine(this.tutorialLines[i], data, 0xd48f8f, perpVec.x * 2, perpVec.y * 2);
            this.drawTutorialLine(this.tutorialLines[i], data, 0x641b1a, -perpVec.x * 2, -perpVec.y * 2);
            this.drawTutorialLine(this.tutorialLines[i], data, 0xf9464d, 0, 0);
        }
    }
    drawTutorialLine(line: Graphics, data: CheckerMoveData, color: number, offsetX: number, offsetY: number) {
        if (!data.checker) {
            return;
        }
        const c = data.checker.container.position;

        const distVec = new Point(c.x - data.end.x, c.y - data.end.y);
        const dist = Math.sqrt(distVec.x * distVec.x + distVec.y * distVec.y);
        const v = 1.0 - dist / data.dist;

        line.lineStyle({
            width: 8,
            color: color,
            alpha: 1,
            cap: LINE_CAP.ROUND,
        });
        line.moveTo(data.start.x, data.start.y);
        if (v <= 0.5) {
            line.bezierCurveTo(
                c.x + offsetX,
                c.y + offsetY,
                c.x + offsetX,
                c.y + offsetY,
                c.x + offsetX,
                c.y + offsetY
            );
        } else {
            line.bezierCurveTo(
                data.mid.x + offsetX,
                data.mid.y + offsetY,
                data.mid.x + offsetX,
                data.mid.y + offsetY,
                c.x + offsetX,
                c.y + offsetY
            );
        }
    }
}
