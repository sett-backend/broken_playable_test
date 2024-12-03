import { Game } from 'components/classes/game';
import { MonoBehavior } from 'components/classes/monoBehavior';
import { Container, DisplayObject, Point, Sprite } from 'pixi.js';
import { Audio, Gfx } from '../assets';
import { Constants, Player } from '../constants';
import { BearOffTray } from './BearOffTray';
import { Checker } from './Checker';
import gsap from 'gsap';

export class Board extends MonoBehavior {
    private rootContainer: Container; // for screen scaling
    private container: Container; // for keeping, like, everything
    checkers: Checker[] = [];
    trays: BearOffTray[];
    boardResizedCb?: (yPos: number) => void;
    constructor() {
        super();
        this.rootContainer = new Container();
        this.container = new Container();

        this.rootContainer.addChild(this.container as DisplayObject);

        const boardSprite = Sprite.from(Gfx.board_wooden_tilt);
        boardSprite.anchor.set(0.5, 0.5);
        this.container.addChild(boardSprite as DisplayObject);

        this.trays = [];
        this.trays[Player.WHITE] = new BearOffTray(372, 343, Player.WHITE);
        this.trays[Player.BLACK] = new BearOffTray(343, -350, Player.BLACK);
        this.trays.forEach((t) => this.container.addChild(t.container as DisplayObject));

        Game.renderer.addResizeCallback(this.onResize.bind(this), this._id);
    }
    start() {
        Game.addToLevel(this.rootContainer);
        this.onResize();
    }
    addChild(child: DisplayObject) {
        this.container.addChild(child);
    }
    addChildAt(child: DisplayObject, index: number) {
        this.container.addChildAt(child, index);
    }
    getChildIndex(child: DisplayObject) {
        return this.container.getChildIndex(child);
    }
    onResize(): void {
        const sceneSize = Game.getSceneSize();

        const sv = (sceneSize.y / Constants.boardSize.y) * 0.7;
        const sh = sceneSize.x / Constants.boardSize.x;
        const s = Math.min(sv, sh);
        this.rootContainer.scale.set(s);
        const boardHeight = Constants.boardSize.y * s;
        this.rootContainer.position.y = sceneSize.y / 2 - boardHeight / 2 - (sceneSize.y - boardHeight) * 0.4;
        if (this.boardResizedCb) {
            this.boardResizedCb(this.rootContainer.position.y);
        }
    }
    checkWin(): Player {
         //DESCRIPTION: check win conditions
        const count = [0, 0];
        this.checkers.forEach((c) => {
            count[c.color]++;
        });
        if (count[Player.WHITE] == 0) {
            return Player.WHITE;
        }
        if (count[Player.BLACK] == 0) {
            return Player.BLACK;
        }
        return Player.NONE;
    }
    addChecker(color: number, position: number) {
        const newChecker = new Checker(color);
        newChecker.position = position;
        this.checkers.push(newChecker);
        this.container.addChild(newChecker.container as DisplayObject);
        newChecker.container.position = this.getCheckerPosition(newChecker);
        return newChecker;
    }
    disableCheckersInput() {
        for (const checker of this.checkers) {
            checker.setInputEnabled(false);
        }
    }
    //DESCRIPTION: remove checker from store
    getCheckersFromPosition(position: number, color: Player) {
        return this.checkers.filter((c) => c.position == position && c.color == color);
    }
    isLastOnPosition(checker: Checker) {
        const checkersOnPosition = this.getCheckersFromPosition(checker.position, checker.color);
        return checkersOnPosition.indexOf(checker) == checkersOnPosition.length - 1;
    }
    getCheckersAvailableForMovement(rolls: number[], color: Player) {
        const checkers: Checker[] = [];
        // const sums = this.getRollsSums(rolls);
        for (const checker of this.checkers) {
            if (checker.color != color) {
                continue;
            }
            if (this.isLastOnPosition(checker) == false) {
                continue;
            }
            const dist = Constants.boardPointsCount - checker.position;
            for (const roll of rolls) {
                if (roll < dist) {
                    checkers.push(checker);
                    break;
                }
            }
        }
        return checkers;
    }
    getCheckersAvailableForBearingOff(rolls: number[], color: Player) {
        const checkers: Checker[] = [];
        for (const num of rolls) {
            const pos = Constants.boardPointsCount - num;
            const posCheckers = this.getCheckersFromPosition(pos, color);
            if (posCheckers.length > 0) {
                checkers.push(posCheckers[posCheckers.length - 1]);
            }
        }

        if (checkers.length == 0) {
            // second try
            // When a player rolls a number that is higher than the highest
            // point of the inner table upon which that player has pieces,
            // the player is allowed to bear off the next highest piece.

            let maxRoll = 0;
            let highestCheckerDistance = 0;
            let highestChecker: Checker | undefined = undefined;
            for (const roll of rolls) {
                maxRoll = Math.max(roll, maxRoll);
            }
            for (const checker of this.checkers) {
                if (checker.color != color) {
                    continue;
                }
                if (this.isLastOnPosition(checker) == false) {
                    continue;
                }
                const dist = Constants.boardPointsCount - checker.position;
                if (dist > highestCheckerDistance) {
                    highestCheckerDistance = Math.max(dist);
                    highestChecker = checker;
                }
            }

            if (maxRoll > highestCheckerDistance && highestChecker) {
                let totalRoll = 0;
                for (const num of rolls) {
                    totalRoll += num;
                }
                if (highestCheckerDistance <= totalRoll) {
                    checkers.push(highestChecker as Checker);
                }
            }
        }
        return checkers;
    }
    removeChecker(checker: Checker) {
        for (let i = 0; i < this.checkers.length; ++i) {
            if (this.checkers[i] == checker) {
                this.checkers.splice(i, 1);
                break;
            }
        }
    }
    bubbleChecker(checker: Checker) {
        // move checker to the top of the hierarchy
        this.removeChecker(checker);
        this.checkers.push(checker);
    }
    getCheckerPosition(checker: Checker) {
        const boardPoints = {
            tl: new Point(-268, -330),
            tr: new Point(276, -330),
            bl: new Point(-287, 315),
            br: new Point(290, 315),
        };

        let position = checker.position;
        if (position >= Constants.boardPointsCount || position < 0) {
            position = Constants.boardPointsCount - 1;
        }
        if (checker.color == Player.WHITE) {
            position = Constants.boardPointsCount - 1 - position;
        }
        const quadrantPoints = Constants.boardPointsCount / 4;
        const quadrant = Math.floor(position / quadrantPoints);
        const pointInQuadrant = position % quadrantPoints;

        const checkersOnPoint = this.getCheckersFromPosition(checker.position, checker.color);
        const checkerIndex = checkersOnPoint.indexOf(checker);
        const checkerOffset = checker.getSize().y * 0.9;

        const topSpacing = 47;
        const topSkew = 0.5;
        const bottomSpacing = 49.7;
        const bottomSkew = 0.8;

        let x = 0;
        let y = 0;

        switch (quadrant) {
            case 0: // bottom-right
                x = boardPoints.br.x - bottomSpacing * pointInQuadrant;
                x -= bottomSkew * checkerIndex;
                y = boardPoints.br.y - checkerOffset * checkerIndex;
                break;
            case 1: // bottom-left
                x = boardPoints.bl.x + bottomSpacing * (quadrantPoints - 1);
                x -= bottomSpacing * pointInQuadrant;
                x += bottomSkew * checkerIndex;
                y = boardPoints.bl.y - checkerOffset * checkerIndex;
                break;
            case 2: // top-left
                x = boardPoints.tl.x + topSpacing * pointInQuadrant;
                x += topSkew * checkerIndex;
                y = boardPoints.tl.y + checkerOffset * checkerIndex;
                break;
            case 3: // top-right
                x = boardPoints.tr.x - topSpacing * (quadrantPoints - 1);
                x += topSpacing * pointInQuadrant;
                x -= topSkew * checkerIndex;
                y = boardPoints.tr.y + checkerOffset * checkerIndex;
                break;
        }

        return new Point(x, y);
    }
    moveCheckerToTray(checker: Checker) {
        const trayChecker = this.trays[checker.color].addChecker();
        trayChecker.visible = false;

        return checker.move(trayChecker.position, () => {
            Audio.play('bear_off');
            checker.destroy();
            trayChecker.visible = true;
            this.trays[checker.color].showWithAnim(trayChecker);
        });
    }
    animateOutroScale() {
        gsap.to(this.container.scale, {
            x: 1.4,
            y: 1.4,
            duration: 0.2,
        });
    }
    fadeOut() {
        gsap.to(this.container, {
            alpha: 0,
            duration: 0.5,
        });
    }
}
