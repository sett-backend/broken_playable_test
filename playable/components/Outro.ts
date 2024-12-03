import { Game } from 'components/classes/game';
import { MonoBehavior } from 'components/classes/monoBehavior';
import gsap from 'gsap';
import { getScreenSize } from 'helper/screen';
import { AnimatedSprite, BLEND_MODES, Container, DEG_TO_RAD, DisplayObject, Sprite, Texture } from 'pixi.js';
import { CTAButton } from 'root/class/ui/OverlayButton';
import { Audio, Gfx } from '../assets';
import { PixiParticles } from './PixiParticles';
import { UIImage } from './UIImage';

export class Outro extends MonoBehavior {
    particlesContainer: Container;
    winContainer: Container;
    playButtonContainer: Container;
    winBanner: UIImage;
    logo: UIImage;
    playButton: Sprite;
    hideGameCb: () => void;
    //DESCRIPTION: CTA Animation
    constructor(hideGameCb: () => void) {
        super();

        this.hideGameCb = hideGameCb;

        this.particlesContainer = new Container();
        this.winContainer = new Container();
        this.playButtonContainer = new Container();

        Game.addToUI(this.particlesContainer);
        Game.addToUI(this.winContainer);
        Game.addToUI(this.playButtonContainer);

        this.winBanner = new UIImage(Gfx.win_banner, false);
        this.winBanner.setSize(0.7, 1.0);

        this.logo = new UIImage(Gfx.logo, false);
        this.logo.setSize(0.6, 0.8);
        this.logo.maxScaleLandscape = 0.5;

        // highlighted pseudo-button thingie
        {
            this.playButton = Sprite.from(Gfx.play_button);
            this.playButton.anchor.set(0.5, 0.0);
            this.playButton.position.y = 250;

            const playButtonHighlight = Sprite.from(Gfx.play_button_highlight);
            playButtonHighlight.scale.set(2, 2);
            playButtonHighlight.anchor.set(0.5, 0.5);
            playButtonHighlight.blendMode = BLEND_MODES.ADD;
            playButtonHighlight.alpha = 1.0;
            playButtonHighlight.rotation = DEG_TO_RAD * -10;
            const playButtonHighlightContainer = new Container();
            const playButtonMask = Sprite.from(Gfx.play_button);
            playButtonMask.anchor.set(0.5, 0.0);
            playButtonHighlightContainer.addChild(playButtonHighlight as DisplayObject);
            playButtonHighlightContainer.addChild(playButtonMask as DisplayObject);
            playButtonHighlightContainer.mask = playButtonMask;
            playButtonHighlight.position.x = -300;
            gsap.to(playButtonHighlight.position, {
                x: 1500,
                duration: 2.0,
                repeat: -1,
            });
            this.playButton.addChild(playButtonHighlightContainer as DisplayObject);
        }

        this.winContainer.addChild(this.winBanner.container as DisplayObject);

        this.playButtonContainer.addChild(this.logo.container as DisplayObject);
        this.logo.contentContainer.addChild(this.playButton as DisplayObject);

        this.winContainer.visible = false;
        this.playButtonContainer.visible = false;
    }
    play() {
        //DESCRIPTION: Fade in animation
        Audio.play('fanfare');
        this.winContainer.visible = true;
        this.winBanner.container.scale.set(0, 0);
        gsap.to(this.winBanner.container.scale, {
            x: 1.0,
            y: 1.0,
            duration: 0.8,
            ease: 'bounce.out',
        });

        gsap.delayedCall(0.2, () => {
            const screenSize = getScreenSize();

            //DESCRIPTION:Confetti animation 
            {
                const colors = [
                    0xffffff, 0xdca8ff, 0xf9f800, 0x1486f7, 0xfbb8a0, 0x06e35a, 0xbffd71, 0x4affcf, 0xc40058, 0x313a86,
                ];
                for (let i = 0; i < 300; ++i) {
                    const confetto = PixiParticles.instance.addParticle(
                        Gfx.confetto,
                        screenSize.width / 2,
                        screenSize.height / 2,
                        this.particlesContainer
                    );
                    const xSpeed = -500 + Math.random() * 1000;
                    confetto.scale.set(0.1 + Math.random() * 0.3, 0.05 + Math.random() * 0.3);
                    confetto.speed.set(xSpeed, -500 + Math.random() * -500);
                    confetto.acceleration.set(0, 1000);
                    confetto.linearDamping.x = 10.0;
                    confetto.lifetime = 3.0;
                    confetto.sprite.rotation = Math.random() * Math.PI * 2;
                    confetto.rotationSpeed = (-Math.PI + Math.random() * Math.PI * 2) * 6;
                    confetto.scaleEasing = (v: number) => {
                        return {
                            x: Math.abs(Math.sin(v * 10)),
                            y: 1,
                        };
                    };

                    confetto.sprite.tint = colors[Math.floor(Math.random() * colors.length)];
                    confetto.sprite.anchor.set(-1 + Math.random() * 2, -1 + Math.random() * 2);
                }
            }

            // Coins
            {
                const coinTextures: Texture[] = [];
                for (const frame of Gfx.coin_anim) {
                    coinTextures.push(Texture.from(frame));
                }

                for (let i = 0; i < 70; ++i) {
                    gsap.delayedCall(i * 0.005, () => {
                        const coinAnim = new AnimatedSprite(coinTextures);
                        coinAnim.animationSpeed = 0.4 + Math.random() * 0.2;
                        coinAnim.play();
                        coinAnim.rotation = Math.random() * Math.PI * 2;
                        const coinParticle = PixiParticles.instance.addParticleSprite(
                            coinAnim,
                            screenSize.width / 2,
                            screenSize.height / 2,
                            this.particlesContainer
                        );

                        const xSpeed = -1000 + Math.random() * 2000;
                        coinParticle.speed.set(xSpeed, -500 + Math.random() * -1000);
                        coinParticle.acceleration.set(-xSpeed * 0.3, 2000);
                        coinParticle.lifetime = 3.0;
                        coinParticle.scale.set(0.25 + Math.random() * 1.0);
                        coinParticle.scaleSpeed = Math.random() * 2.5;
                        coinParticle.rotationSpeed = -Math.PI + Math.random() * Math.PI * 2;
                        // coinParticle.scaleEasing = scaleEaseFadeOutConst;
                        coinParticle.sprite.zIndex = 5;
                    });
                }
            }
        });

        gsap.delayedCall(2.5, () => {
            this.hideGameCb();
            gsap.to(this.winContainer, {
                alpha: 0,
                duration: 0.5,
                onComplete: () => {
                    this.winContainer.visible = false;
                    this.playButtonContainer.visible = true;
                    this.playButtonContainer.alpha = 0.0;
                    //DESCRIPTION CTABUTTON make full screen overlay with click redirect to the links
                    new CTAButton();

                    this.logo.container.scale.set(4, 4);
                    gsap.to(this.logo.container.scale, {
                        x: 1,
                        y: 1,
                        ease: 'power1.out',
                        duration: 0.5,
                    });

                    gsap.to(this.playButtonContainer, {
                        alpha: 1.0,
                        duration: 0.5,
                    });
                },
            });
        });
    }
}
