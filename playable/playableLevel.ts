import { Game } from 'components/classes/game';
import { MonoBehavior } from 'components/classes/monoBehavior';
import { Point, Sprite } from 'pixi.js';
import { UITimer } from './components/UITimer';
import { Audio, Gfx } from './assets';
import { Board } from './components/Board';
import { Checker } from './components/Checker';
import { Dice } from './components/Dice';
import { Constants, Player } from './constants';
import gsap from 'gsap';
import { Outro } from './components/Outro';
import { Intro } from './components/Intro';
import { PixiParticles } from './components/PixiParticles';
import { SceneLight } from './SceneLight';
import { EventsName, GameEvent } from 'components/classes/gameEvents';
import { openStoreLink } from 'helper/adProtocols';
const MOVE_LIMIT = 10;
export class PlayableLevel extends MonoBehavior {
    board: Board;
    dice: Dice[];
    currentRolls: number[] = [];
    currentPlayer = Player.WHITE;
    turnsCount = 0;
    intro: Intro;
    outro: Outro;
    moveDone = 0;
    timer: UITimer;
    constructor() {
        super();
        this.countMove = this.countMove.bind(this);
        this.timer = new UITimer(() => this.onTimerExpired());
        new PixiParticles();
        new SceneLight();
        GameEvent.addListener(EventsName.MOVE, this.countMove);
        //DESCRIPTION: Set Background
        {
            Game.renderer.bgEnvelopeSize = new Point(1200, 1200);
            const bg = Sprite.from(Gfx.spiral_bg);
            bg.anchor.set(0.5, 0.5);
            Game.addToBackground(bg);
             //DESCRIPTION: define animation in seconds
            gsap.to(bg.scale, {
                x: 1.3,
                y: 1.3,
                duration: 60,
            });
        }

      //DESCRIPTION:board and checkers
        {
            this.board = new Board();

            const whites = [23, 23, 23, 22, 22, 21, 21, 21, 21, 20, 20, 18];
            const blacks = [23, 23, 23, 23, 22, 22, 22, 21, 21, 21, 20, 20, 20, 19];
            for (const pos of whites) {
                this.board.addChecker(Player.WHITE, pos);
            }
            for (const pos of blacks) {
                this.board.addChecker(Player.BLACK, pos);
            }

            this.board.boardResizedCb = this.onBoardResized.bind(this);
        }

       //DESCRIPTION: create dice
        {
            this.dice = [];
            this.dice[Player.WHITE] = new Dice(Player.WHITE);
            this.dice[Player.BLACK] = new Dice(Player.BLACK);
        }

       //DESCRIPTION: intro roll dice
        {
            // this.dice[Player.BLACK].showWithResult(6, 6);
            const introChecker2 = this.board.addChecker(Player.BLACK, 18);
            const introChecker1 = this.board.addChecker(Player.BLACK, 6);
            const introCheckers = [introChecker1, introChecker2];

            this.intro = new Intro(introCheckers, this.board, () => {
                this.startNewTurn();
            });
        }

        this.outro = new Outro(() => {
            this.board.fadeOut();
        });
    }
    countMove() {
         //DESCRIPTION: count move to CTA
        this.moveDone++;
        if (this.moveDone >= MOVE_LIMIT) {
            openStoreLink();
        }
    }
    start() {
        Game.removeGameLoader();
        this.intro.play();
        // this.board.animateOutroScale();
        // this.outro.play();
    }
    onBoardResized(boardY: number) {
        const sceneSize = Game.getSceneSize();
        const offset = boardY / sceneSize.y - 0.03;
        for (const die of this.dice) {
            die.group.position.z = offset * 70;
        }
    }
    startNewTurn() {
        this.dice.forEach((d) => d.hide());
        gsap.delayedCall(1.0, () => {
            this.board.disableCheckersInput();

            /**
                Every 3rd round roll a double for the player
                Otherwise, try to get the best outcome out of 7 tries for the player
                For the computer, just choose any random valid move
            */

            if (this.currentPlayer == Player.WHITE) {
                this.turnsCount++;
            }

            let tries = 0;
            let bestRoll = 0;
            let bestOutcome = -1;
            for (;;) {
                tries++;
                let roll = Dice.fixDoubles([Dice.getSingleRoll(), Dice.getSingleRoll()]);
                if (this.currentPlayer == Player.WHITE && this.turnsCount % 3 == 0) {
                    const doubleRoll = Dice.getSingleRoll();
                    roll = Dice.fixDoubles([doubleRoll, doubleRoll]);
                }
                const availableCheckers = this.board.getCheckersAvailableForBearingOff(roll, this.currentPlayer);
                const movableCheckers = this.board.getCheckersAvailableForMovement(
                    this.currentRolls,
                    this.currentPlayer
                );

                if (this.currentPlayer == Player.WHITE) {
                    const rollSum = Dice.sumRolls(roll);
                    if (
                        availableCheckers.length > bestOutcome ||
                        (availableCheckers.length == bestOutcome && rollSum > bestRoll)
                    ) {
                        bestOutcome = availableCheckers.length;
                        bestRoll = rollSum;
                        this.currentRolls = roll;
                    }
                    if (tries > 7) {
                        break;
                    }
                } else {
                    this.currentRolls = roll;
                    if ((availableCheckers.length > 0 || movableCheckers.length > 0) && roll.length == 2) {
                        break;
                    }
                    if (tries > 100) {
                        break;
                    }
                }
            }

            gsap.delayedCall(0.35, () => {
                Audio.play('dice_roll');
            });
            // this.currentRolls = [1, 1, 1, 1];
            this.dice[this.currentPlayer].rollValues(this.currentRolls[0], this.currentRolls[1]);
            this.currentRolls.sort((a, b) => b - a);
            gsap.delayedCall(Dice.getRollDuration(), () => {
                this.processTurn(this.currentPlayer);
            });
        });
    }
    onTimerExpired() {
        if (this.currentPlayer === Player.WHITE) {
            Audio.play('checkrs_tap');
            this.board.disableCheckersInput();
            this.currentRolls = [];
            this.timer.stopTimer();
            this.currentPlayer = Player.BLACK;
            gsap.delayedCall(0.5, () => {
                this.startNewTurn();
            });
        }
    }

    processTurn(color: Player) {
        const bearableCheckers = this.board.getCheckersAvailableForBearingOff(this.currentRolls, color);
        const movableCheckers = this.board.getCheckersAvailableForMovement(this.currentRolls, color);
        
        if (color === Player.WHITE) {
            this.timer.startTimer();
        } else {
            this.timer.stopTimer();
        }

        if (this.currentRolls.length > 0 && (bearableCheckers.length > 0 || movableCheckers.length > 0)) {
            if (this.currentPlayer == Player.WHITE) {
                // player turn
                for (const checker of bearableCheckers) {
                    checker.setInputEnabled(true, this.bearOffChecker.bind(this));
                }
                for (const checker of movableCheckers) {
                    if (!bearableCheckers.includes(checker)) {
                        checker.setInputEnabled(true, this.moveChecker.bind(this));
                    }
                }

                this.board.getCheckersAvailableForMovement(this.currentRolls, this.currentPlayer);
            } else {
                // computer's turn
                gsap.delayedCall(0.5, () => {
                    if (bearableCheckers.length > 0) {
                        const randomChecker = bearableCheckers[Math.floor(Math.random() * bearableCheckers.length)];
                        this.bearOffChecker(randomChecker);
                    } else if (movableCheckers.length > 0) {
                        const randomChecker = movableCheckers[Math.floor(Math.random() * movableCheckers.length)];
                        this.moveChecker(randomChecker);
                    }
                });
            }
        } else {
            // no moves possible, swap players and start new turn or end the game
            if (this.board.checkWin() != Player.NONE) {
                this.board.animateOutroScale();
                for (const die of this.dice) {
                    die.hide();
                }
                this.outro.play();
            } else {
                this.currentPlayer = this.currentPlayer == Player.WHITE ? Player.BLACK : Player.WHITE;
                this.startNewTurn();
            }
        }
    }
    moveChecker(checker: Checker) {
        if (checker.color === Player.WHITE) GameEvent.emit(EventsName.MOVE);
        Audio.play('checkrs_tap');
        this.board.disableCheckersInput();
        let movementCost = 0;
        for (let i = 0; i < this.currentRolls.length; ++i) {
            if (checker.position + this.currentRolls[i] < Constants.boardPointsCount) {
                movementCost = this.currentRolls[i];
                this.currentRolls.splice(i, 1);
                break;
            }
        }

        this.board.bubbleChecker(checker);
        checker.position += movementCost;
        if (checker.position > Constants.boardPointsCount || checker.position < 0) {
            checker.position = Constants.boardPointsCount - 1;
        }
        const targetPos = this.board.getCheckerPosition(checker);
        checker.move(targetPos, undefined, 0.3);

        this.processTurn(this.currentPlayer);
    }
    bearOffChecker(checker: Checker) {
        if (checker.color === Player.WHITE) GameEvent.emit(EventsName.MOVE);

        Audio.play('checkrs_tap');
        this.board.disableCheckersInput();
        this.board.removeChecker(checker);
        const movementCost = Constants.boardPointsCount - checker.position;

        let paid = false;
        for (let i = 0; i < this.currentRolls.length; ++i) {
            if (this.currentRolls[i] == movementCost) {
                this.currentRolls.splice(i, 1);
                paid = true;
                break;
            }
        }
        if (!paid) {
            let coveredCost = 0;
            for (let i = 0; i < this.currentRolls.length; ++i) {
                coveredCost += this.currentRolls[i];
                if (coveredCost >= movementCost) {
                    this.currentRolls.splice(0, i + 1);
                    break;
                }
            }
        }
        this.processTurn(this.currentPlayer);
        this.board.moveCheckerToTray(checker);
    }
}
