import gsap from 'gsap';
import { Group } from 'three';
import { Player } from '../constants';
import { Game } from 'components/classes/game';
import { Die3d } from './Die3d';

const ROLL_DURATION = [0.7, 0.4];

export class Dice {
    group: Group;
    dice: Die3d[];

    constructor(player: Player) {
        this.group = new Group();
        
        this.dice = [new Die3d(player), new Die3d(player)];
        for (const die of this.dice) {
            this.group.add(die.group);
            die.opacity = 0;
        }
        const diceSpacing = 0.8;
        this.dice[1].group.position.x = -diceSpacing;
        this.dice[0].group.position.x = diceSpacing;

        Game.canvas3D?.scene.add(this.group);

        if (player == Player.WHITE) {
            this.group.rotateY(Math.PI / 2);
            this.group.position.x = 5;
        } else {
            this.group.rotateY(-Math.PI / 2);
            this.group.position.x = -5;
        }
    }
    static getSingleRoll() {
        return Math.floor(Math.random() * 6) + 1;
    }
    static fixDoubles(roll: number[]) {
        if (roll[0] == roll[1]) {
            return [roll[0], roll[0], roll[0], roll[0]];
        }
        return roll;
    }
    static sumRolls(rolls: number[]) {
        let sum = 0;
        for (const roll of rolls) {
            sum += roll;
        }
        return sum;
    }
    roll() {
        //DESCRIPTION: roll dices
        const roll1 = Dice.getSingleRoll();
        const roll2 = Dice.getSingleRoll();
        this.rollValues(roll1, roll2);
        return [roll1, roll2];
    }
    rollValues(val1: number, val2: number) {
        this.dice[0].playAnim('roll_' + val1);
        gsap.delayedCall(0.2, () => {
            this.fade(1, 0.1);
            this.dice[1].playAnim('roll_' + val2);
        });
    }
    static getRollDuration() {
        return Math.max(ROLL_DURATION[0], ROLL_DURATION[1]);
    }
    showWithResult(result1: number, result2: number) {
        for (const die of this.dice) {
            die.opacity = 1;
        }
        this.dice[0].playEnd('roll_' + result1);
        this.dice[1].playEnd('roll_' + result2);
    }
    hide() {
        this.fade(0, 0.5);
    }
    private fade(target: number, duration: number) {
        const delta = Math.abs(target - this.dice[0].opacity);
        duration *= delta;
        for (const die of this.dice) {
            gsap.killTweensOf(die);
            gsap.to(die, {
                opacity: target,
                duration: duration,
            });
        }
    }
}
