import { Container, Text, Graphics } from 'pixi.js';
import { MonoBehavior } from 'components/classes/monoBehavior';
import { Game } from 'components/classes/game';
import { Constants } from '../constants';

export class UITimer extends MonoBehavior {
    private container: Container;
    private timerText: Text;
    private timerBg: Graphics;
    private timeLeft: number;
    private onTimeUp: () => void;

    constructor(onTimeUp: () => void) {
        super();
        this.onTimeUp = onTimeUp;
        this.container = new Container();
        
        // Create background
        this.timerBg = new Graphics();
        this.timerBg.beginFill(0x000000, 0.5);
        this.timerBg.drawRoundedRect(0, 0, 80, 40, 10);
        this.timerBg.endFill();
        
        // Create timer text
        this.timerText = new Text('15', {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0xFFFFFF,
            align: 'center'
        });
        this.timerText.anchor.set(0.5);
        this.timerText.position.set(40, 20);
        
        this.container.addChild(this.timerBg);
        this.container.addChild(this.timerText);
        
        // Position the timer in the top-right corner
        this.container.position.set(
            Game.getSceneSize().x - 100,
            20
        );
        
        Game.addToScene(this.container);
        this.hide();
    }

    startTimer() {
        this.timeLeft = Constants.turnTimeLimit;
        this.updateTimerText();
        this.show();
        this.update();
    }

    stopTimer() {
        this.hide();
    }

    private updateTimerText() {
        this.timerText.text = Math.ceil(this.timeLeft).toString();
    }

    show() {
        this.container.visible = true;
    }

    hide() {
        this.container.visible = false;
    }

    update(): void {
        if (this.container.visible && this.timeLeft > 0) {
            this.timeLeft -= Game.deltaTime;
            this.updateTimerText();
            
            if (this.timeLeft <= 0) {
                this.timeLeft = 0;
                this.updateTimerText();
                this.onTimeUp();
            }
        }
    }
}
