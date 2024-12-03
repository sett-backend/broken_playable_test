import { SoundManager } from 'components/managers/soundManager';

import spiral_bg from 'assets/gfx/spiral_bg.jpg';
import board_wooden_tilt from 'assets/gfx/board_wooden_tilt.png';
import checker_white_side from 'assets/gfx/checker_white_side.png';
import checker_black_side from 'assets/gfx/checker_black_side.png';
import dice_white from 'assets/gfx/dice.png';
import dice_red from 'assets/gfx/dice_red.png';
import checker_white from 'assets/gfx/checker_white.png';
import checker_black from 'assets/gfx/checker_black.png';
import checker_green_highlight from 'assets/gfx/checker_green_highlight.png';
import checker_tutorial_highlight from 'assets/gfx/checker_tutorial_highlight.png';
import tutorial_trail from 'assets/gfx/tutorial_trail.png';
import intro_dice from 'assets/gfx/intro_dice.png';
import win_banner from 'assets/gfx/win_banner.png';
import logo from 'assets/gfx/logo.png';
import play_button from 'assets/gfx/play_button.png';
import play_button_highlight from 'assets/gfx/play_button_highlight.png';
import confetto from 'assets/gfx/confetto.png';

import coin_anim_01 from 'assets/gfx/coin_anim/01.png';
import coin_anim_02 from 'assets/gfx/coin_anim/02.png';
import coin_anim_03 from 'assets/gfx/coin_anim/03.png';
import coin_anim_04 from 'assets/gfx/coin_anim/04.png';
import coin_anim_05 from 'assets/gfx/coin_anim/05.png';
import coin_anim_06 from 'assets/gfx/coin_anim/06.png';
import coin_anim_07 from 'assets/gfx/coin_anim/07.png';
import coin_anim_08 from 'assets/gfx/coin_anim/08.png';

import sfx_bear_off from 'assets/sound/bear_off.mp3';
import sfx_checkers_slide from 'assets/sound/checkers_slide.mp3';
import sfx_checkrs_tap from 'assets/sound/checkrs_tap.mp3';
import sfx_dice_roll from 'assets/sound/dice_roll.mp3';
import sfx_fanfare from 'assets/sound/fanfare.mp3';

//DESCRIPTION add assets here

export const Gfx = {
    spiral_bg: spiral_bg,
    board_wooden_tilt: board_wooden_tilt,
    checker_white_side: checker_white_side,
    checker_black_side: checker_black_side,
    dice_white: dice_white,
    dice_red: dice_red,
    checker_white: checker_white,
    checker_black: checker_black,
    checker_green_highlight: checker_green_highlight,
    checker_tutorial_highlight: checker_tutorial_highlight,
    tutorial_trail: tutorial_trail,
    intro_dice: intro_dice,
    win_banner: win_banner,
    logo: logo,
    play_button: play_button,
    play_button_highlight: play_button_highlight,
    confetto: confetto,
    coin_anim: [
        coin_anim_01,
        coin_anim_02,
        coin_anim_03,
        coin_anim_04,
        coin_anim_05,
        coin_anim_06,
        coin_anim_07,
        coin_anim_08,
    ],
};

const SOUND_MAP: { [key: string]: string } = {
    bear_off: sfx_bear_off,
    checkers_slide: sfx_checkers_slide,
    checkrs_tap: sfx_checkrs_tap,
    dice_roll: sfx_dice_roll,
    fanfare: sfx_fanfare,
};

export class Audio {
    static play(soundName: string) {
        SoundManager.play(SOUND_MAP[soundName]);
    }
    static playMusic(soundName: string) {
        SoundManager.play(SOUND_MAP[soundName], { force: true, autoplay: true, loop: true });
    }
}
